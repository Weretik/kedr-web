import { zodResolver } from '@hookform/resolvers/zod';
import { useCart, useCreateCartOrderMutation } from '@mobile/cart/data-access';
import {
  calculateCartTotal,
  createAdminOrderPayload,
  resolveOrderAttempt,
  type OrderSyncStatus,
  type OrderAttempt,
} from '@mobile/cart/model';
import { useGetCustomersQuery } from '@mobile/customers/data-access';
import { filterCustomersByName, type Customer } from '@mobile/customers/model';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  checkoutFormSchema,
  createIdempotencyKey,
  type CheckoutFormValues,
} from '../lib/checkout-form';
import { applyOrderError, canReuseOrderAttempt } from '../lib/order-error';

export interface OrderReceipt {
  orderNumber: string;
  syncStatus: OrderSyncStatus;
}

export function useCartCheckoutController() {
  const cart = useCart();
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const attempt = useRef<OrderAttempt | null>(null);
  const submitLocked = useRef(false);
  const customersQuery = useGetCustomersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !checkoutVisible,
  });
  const [createOrder, createState] = useCreateCartOrderMutation();
  const form = useForm<CheckoutFormValues>({
    defaultValues: { comment: '', counterpartyId: '' },
    resolver: zodResolver(checkoutFormSchema),
  });
  const customerId = form.watch('counterpartyId');
  const comment = form.watch('comment');
  const customers = customersQuery.data ?? [];
  const selectedCustomer = customers.find((customer) => customer.counterpartyId === customerId);
  const filteredCustomers = useMemo(
    () => filterCustomersByName(customers, query),
    [customers, query],
  );

  const submit = form.handleSubmit(async (values) => {
    if (submitLocked.current || createState.isLoading || cart.lines.length === 0 || receipt) return;

    submitLocked.current = true;
    setSubmitError(null);
    const payload = createAdminOrderPayload(cart.lines, values.counterpartyId, values.comment);
    const nextAttempt = resolveOrderAttempt(payload, attempt.current, createIdempotencyKey);
    attempt.current = nextAttempt;

    try {
      const created = await createOrder({
        idempotencyKey: nextAttempt.idempotencyKey,
        payload,
      }).unwrap();
      setReceipt({ orderNumber: created.orderNumber, syncStatus: created.syncStatus });
      setCheckoutVisible(false);
      setSelectorVisible(false);
      form.reset();
      await cart.clear();
    } catch (error) {
      submitLocked.current = false;
      setSubmitError(applyOrderError(error, form.setError));
      if (!canReuseOrderAttempt(error)) attempt.current = null;
    }
  });

  const selectCustomer = (customer: Customer) => {
    form.setValue('counterpartyId', customer.counterpartyId, { shouldValidate: true });
    form.clearErrors('counterpartyId');
    setSubmitError(null);
    setSelectorVisible(false);
  };

  return {
    cart,
    checkout: {
      close: () => setCheckoutVisible(false),
      comment,
      commentError: form.formState.errors.comment?.message,
      customerError: form.formState.errors.counterpartyId?.message,
      open: () => {
        submitLocked.current = false;
        setReceipt(null);
        setCheckoutVisible(true);
      },
      openCustomerSelector: () => setSelectorVisible(true),
      setComment: (value: string) => {
        form.setValue('comment', value, { shouldValidate: form.formState.isSubmitted });
        setSubmitError(null);
      },
      submit: () => void submit(),
      submitError,
      submitting: createState.isLoading,
      visible: checkoutVisible,
    },
    customers: {
      close: () => setSelectorVisible(false),
      error: customersQuery.isError,
      filtered: filteredCustomers,
      loading: customersQuery.isLoading || customersQuery.isFetching,
      query,
      retry: () => void customersQuery.refetch(),
      select: selectCustomer,
      selectedName: selectedCustomer?.name,
      setQuery,
      visible: selectorVisible,
    },
    receipt,
    total: calculateCartTotal(cart.lines),
  };
}
