import { useSelectedCustomer } from '@mobile/customers/data-access';
import { StateView, useBreakpoint } from '@mobile/shared/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ProductDetail } from './product-detail';
import { ProductList } from './product-list';

export interface ProductCatalogProps {
  isOnline: boolean | null;
  /** Phone: opens the product screen. */
  onOpenProduct: (productId: number) => void;
}

/** Products priced for the chosen customer; tablet keeps the list and the detail side by side (R-017). */
export function ProductCatalog({ isOnline, onOpenProduct }: Readonly<ProductCatalogProps>) {
  const isPhone = useBreakpoint() === 'phone';
  const customer = useSelectedCustomer();
  const counterpartyId = customer?.counterpartyId ?? null;
  const [openedId, setOpenedId] = useState<number | null>(null);

  if (isPhone) {
    return (
      <ProductList counterpartyId={counterpartyId} isOnline={isOnline} onOpen={onOpenProduct} />
    );
  }

  return (
    <View style={styles.split}>
      <View style={styles.list}>
        <ProductList
          counterpartyId={counterpartyId}
          isOnline={isOnline}
          onOpen={setOpenedId}
          openedId={openedId}
        />
      </View>
      <View style={styles.detail}>
        {openedId === null ? (
          <StateView
            kind="empty"
            message="Фото, схема і ціна відкриються праворуч."
            title="Оберіть товар"
          />
        ) : (
          <ProductDetail
            counterpartyId={counterpartyId}
            customerName={customer?.name ?? null}
            isOnline={isOnline}
            key={openedId}
            productId={openedId}
            sideBySide
          />
        )}
      </View>
    </View>
  );
}

/** The product screen of a phone, priced for the chosen customer. */
export function ProductScreen({
  isOnline,
  productId,
}: Readonly<{ isOnline: boolean | null; productId: number }>) {
  const customer = useSelectedCustomer();
  return (
    <ProductDetail
      counterpartyId={customer?.counterpartyId ?? null}
      customerName={customer?.name ?? null}
      isOnline={isOnline}
      key={productId}
      productId={productId}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  detail: { flex: 3 },
  list: { flex: 2, maxWidth: 480 },
  split: { flex: 1, flexDirection: 'row', gap: theme.space.lg },
}));
