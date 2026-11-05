import { useSelectedCustomer } from '@mobile/customers/data-access';
import { StateView, useBreakpoint } from '@mobile/shared/ui';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ProductDetail } from './product-detail';
import { ProductList } from './product-list';

import type { PricedProduct } from '@mobile/catalog/model';

export interface ProductCatalogProps {
  isOnline: boolean | null;
  /** Phone: opens the product screen. */
  onOpenProduct: (productId: number) => void;
  /** «+» and «Додати в розрахунок»: adds to the chosen customer's calculation. */
  onAdd?: (product: PricedProduct) => void;
  /** Wide tablet: the calculation stays on screen next to the products (R-017, SC-024). */
  sidePanel?: ReactNode;
}

/**
 * Products priced for the chosen customer; tablet keeps the list and the detail side by side, a wide tablet also
 * the calculation (R-017).
 */
export function ProductCatalog({
  isOnline,
  onAdd,
  onOpenProduct,
  sidePanel,
}: Readonly<ProductCatalogProps>) {
  const breakpoint = useBreakpoint();
  const isPhone = breakpoint === 'phone';
  const showPanel = breakpoint === 'wide' && sidePanel !== undefined;
  const customer = useSelectedCustomer();
  const counterpartyId = customer?.counterpartyId ?? null;
  const [openedId, setOpenedId] = useState<number | null>(null);

  if (isPhone) {
    return (
      <ProductList
        counterpartyId={counterpartyId}
        isOnline={isOnline}
        onAdd={onAdd}
        onOpen={onOpenProduct}
      />
    );
  }

  return (
    <View style={styles.split}>
      <View style={styles.list}>
        <ProductList
          counterpartyId={counterpartyId}
          isOnline={isOnline}
          onAdd={onAdd}
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
            onAdd={onAdd}
            productId={openedId}
            sideBySide={!showPanel}
          />
        )}
      </View>
      {showPanel ? <View style={styles.panel}>{sidePanel}</View> : null}
    </View>
  );
}

/** The product screen of a phone, priced for the chosen customer. */
export function ProductScreen({
  isOnline,
  onAdd,
  productId,
}: Readonly<{
  isOnline: boolean | null;
  onAdd?: (product: PricedProduct) => void;
  productId: number;
}>) {
  const customer = useSelectedCustomer();
  return (
    <ProductDetail
      counterpartyId={customer?.counterpartyId ?? null}
      customerName={customer?.name ?? null}
      isOnline={isOnline}
      key={productId}
      onAdd={onAdd}
      productId={productId}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  detail: { flex: 3 },
  list: { flex: 2, maxWidth: 480 },
  panel: { flex: 3, minWidth: 360 },
  split: { flex: 1, flexDirection: 'row', gap: theme.space.lg },
}));
