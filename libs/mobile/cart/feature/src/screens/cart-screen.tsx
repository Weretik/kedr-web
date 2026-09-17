import { CartView, CheckoutSheet } from '@mobile/cart/ui';
import { CustomerSelectorSheet } from '@mobile/customers/ui';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCartCheckoutController } from '../hooks/use-cart-checkout-controller';

export function CartScreen() {
  const controller = useCartCheckoutController();
  const { cart, checkout, customers, receipt, total } = controller;

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }} testID="cart-screen">
        <CartView
          isReady={cart.isReady}
          lines={cart.lines}
          onCheckout={checkout.open}
          onDecrement={cart.decrement}
          onIncrement={cart.increment}
          onRemove={cart.remove}
          receipt={receipt}
          storageError={Boolean(cart.storageError)}
          total={total}
        />
        <CheckoutSheet
          comment={checkout.comment}
          commentError={checkout.commentError}
          customerError={checkout.customerError}
          errorMessage={checkout.submitError}
          lineCount={cart.lines.length}
          onCommentChange={checkout.setComment}
          onDismiss={checkout.close}
          onOpenCustomerSelector={checkout.openCustomerSelector}
          onSubmit={checkout.submit}
          selectedCustomerName={customers.selectedName}
          submitting={checkout.submitting}
          total={total}
          visible={checkout.visible}
        />
        <CustomerSelectorSheet
          customers={customers.filtered}
          error={customers.error}
          loading={customers.loading}
          onDismiss={customers.close}
          onQueryChange={customers.setQuery}
          onRetry={customers.retry}
          onSelect={customers.select}
          query={customers.query}
          visible={customers.visible}
        />
      </View>
    </SafeAreaView>
  );
}
