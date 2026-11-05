import { useSelectedCustomer } from '@mobile/customers/data-access';
import { Button, StateView, useBreakpoint } from '@mobile/shared/ui';
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
 * Products priced for the chosen customer; a tablet keeps the list and the detail side by side, a wide tablet keeps
 * the calculation next to the products and opens a product in the list's place (R-017).
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

  const list = (
    <ProductList
      counterpartyId={counterpartyId}
      isOnline={isOnline}
      onAdd={onAdd}
      onOpen={setOpenedId}
      openedId={openedId}
    />
  );
  const detail =
    openedId === null ? null : (
      <ProductDetail
        counterpartyId={counterpartyId}
        customerName={customer?.name ?? null}
        isOnline={isOnline}
        key={openedId}
        onAdd={onAdd}
        productId={openedId}
      />
    );

  // Wide: the calculation keeps its column, so an opened product takes the list's place at full width and its
  // photo and scheme stay side by side (SC-024, SC-025).
  if (showPanel) {
    return (
      <View style={styles.split}>
        <View style={styles.main}>
          {detail ? (
            <View style={styles.opened}>
              <View style={styles.back}>
                <Button
                  icon="arrow-left"
                  label="До списку товарів"
                  onPress={() => setOpenedId(null)}
                  variant="text"
                />
              </View>
              {detail}
            </View>
          ) : (
            list
          )}
        </View>
        <View style={styles.panel}>{sidePanel}</View>
      </View>
    );
  }

  return (
    <View style={styles.split}>
      <View style={styles.list}>{list}</View>
      <View style={styles.detail}>
        {detail ?? (
          <StateView
            kind="empty"
            message="Фото, схема і ціна відкриються праворуч."
            title="Оберіть товар"
          />
        )}
      </View>
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
  back: { alignSelf: 'flex-start' },
  detail: { flex: 3 },
  list: { flex: 2, maxWidth: 480 },
  main: { flex: 3 },
  opened: { flex: 1, gap: theme.space.xs },
  panel: { flex: 2, maxWidth: 520, minWidth: 360 },
  split: { flex: 1, flexDirection: 'row', gap: theme.space.lg },
}));
