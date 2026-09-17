import { useGetOrderDetailQuery } from '@mobile/orders/data-access';

export function useOrderDetailController(orderId: number | undefined) {
  const validOrderId = typeof orderId === 'number' && Number.isInteger(orderId) && orderId > 0;
  const queryResult = useGetOrderDetailQuery(orderId ?? 0, { skip: !validOrderId });
  const status =
    typeof queryResult.error === 'object' && queryResult.error && 'status' in queryResult.error
      ? queryResult.error.status
      : undefined;
  return { ...queryResult, invalid: !validOrderId, notFound: status === 404 };
}
