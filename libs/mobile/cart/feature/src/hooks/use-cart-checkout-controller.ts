import { zodResolver } from '@hookform/resolvers/zod';
import { useCart, useCreateCartOrderMutation } from '@mobile/cart/data-access';
import {
  calculateCartTotal,
  createAdminOrderPayload,
  resolveOrderAttempt,
  type OrderAttempt,
} from '@mobile/cart/model';
import { type Customer } from '@mobile/customers/model';
import { type OrderSyncStatus } from '@mobile/shared/model';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCheckoutCustomers } from './use-checkout-customers';
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const attempt = useRef<OrderAttempt | null>(null);
  const submitLocked = useRef(false);
  const [createOrder, createState] = useCreateCartOrderMutation();
  const form = useForm<CheckoutFormValues>({
    defaultValues: { comment: '', counterpartyId: '' },
    resolver: zodResolver(checkoutFormSchema),
  });
  const customerId = form.watch('counterpartyId');
  const comment = form.watch('comment');
  const {
    close: closeSelector,
    open: openSelector,
    ...customers
  } = useCheckoutCustomers(checkoutVisible, customerId);

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
      closeSelector();
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
    closeSelector();
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
      openCustomerSelector: openSelector,
      setComment: (value: string) => {
        form.setValue('comment', value, { shouldValidate: form.formState.isSubmitted });
        setSubmitError(null);
      },
      submit: () => void submit(),
      submitError,
      submitting: createState.isLoading,
      visible: checkoutVisible,
    },
    customers: { ...customers, close: closeSelector, select: selectCustomer },
    receipt,
    total: calculateCartTotal(cart.lines),
  };
}
