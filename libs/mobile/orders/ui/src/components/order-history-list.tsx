import { FlashList } from '@shopify/flash-list';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { OrderCard } from './order-card';
import { OrderHistoryFooter } from './order-history-footer';

import type { OrderSummary } from '@mobile/orders/model';

export interface OrderHistoryListProps {
  items: readonly OrderSummary[];
  hasNextPage: boolean;
  nextPageError: boolean;
  loadingNextPage: boolean;
  refreshing: boolean;
  onLoadMore: () => void;
  onOpenOrder: (order: OrderSummary) => void;
  onRefresh: () => void;
  onRetryNextPage: () => void;
}
export function OrderHistoryList(props: Readonly<OrderHistoryListProps>) {
  return (
    <FlashList
      contentContainerStyle={styles.content}
      data={[...props.items]}
      keyExtractor={(item) => String(item.orderId)}
      renderItem={({ item }) => <OrderCard order={item} onPress={props.onOpenOrder} />}
      refreshControl={<RefreshControl refreshing={props.refreshing} onRefresh={props.onRefresh} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={
        <OrderHistoryFooter
          error={props.nextPageError}
          hasNextPage={props.hasNextPage}
          loading={props.loadingNextPage}
          onLoadMore={props.onLoadMore}
          onRetry={props.onRetryNextPage}
        />
      }
    />
  );
}
const styles = StyleSheet.create({ content: { padding: 16 }, separator: { height: 12 } });
