import { useCart } from '@mobile/cart/data-access';
import { canAddProductToCart } from '@mobile/cart/model';
import { useGetCatalogProductDetailsQuery } from '@mobile/catalog/data-access';
import { useState } from 'react';

import type { CatalogProductDetails } from '@mobile/catalog/model';
import type { ApiError } from '@mobile/shared/api-client';

export type ProductDetailsPageState =
  | { kind: 'invalid' }
  | { kind: 'offline'; onRetry: () => void }
  | { kind: 'loading' }
  | { kind: 'not_found'; onRetry: () => void }
  | { kind: 'error'; onRetry: () => void }
  | {
      kind: 'ready';
      addToCartDisabled: boolean;
      addToCartDisabledReason?: string;
      onAddToCart: () => void;
      product: CatalogProductDetails;
    };

interface UseProductDetailsControllerOptions {
  isOnline: boolean;
  productSlug?: string;
}

interface ProductDetailsController {
  cartMessage: string | null;
  dismissCartMessage: () => void;
  pageState: ProductDetailsPageState;
}

export function useProductDetailsController({
  isOnline,
  productSlug,
}: Readonly<UseProductDetailsControllerOptions>): ProductDetailsController {
  const normalizedSlug = productSlug?.trim() ?? '';
  const validSlug = normalizedSlug.length > 0;
  const { addProduct, isReady: isCartReady } = useCart();
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const queryResult = useGetCatalogProductDetailsQuery(normalizedSlug, {
    skip: !validSlug,
  });
  const onRetry = () => void queryResult.refetch();

  if (!validSlug) {
    return {
      cartMessage,
      dismissCartMessage: () => setCartMessage(null),
      pageState: { kind: 'invalid' },
    };
  }

  if (!queryResult.data && !isOnline) {
    return {
      cartMessage,
      dismissCartMessage: () => setCartMessage(null),
      pageState: { kind: 'offline', onRetry },
    };
  }

  if (!queryResult.data && (queryResult.isLoading || queryResult.isFetching)) {
    return {
      cartMessage,
      dismissCartMessage: () => setCartMessage(null),
      pageState: { kind: 'loading' },
    };
  }

  if (!queryResult.data && queryResult.isError) {
    const error = queryResult.error as ApiError | undefined;
    return {
      cartMessage,
      dismissCartMessage: () => setCartMessage(null),
      pageState: { kind: error?.code === 'NotFound' ? 'not_found' : 'error', onRetry },
    };
  }

  if (!queryResult.data) {
    return {
      cartMessage,
      dismissCartMessage: () => setCartMessage(null),
      pageState: { kind: 'loading' },
    };
  }

  const product = queryResult.data;
  const eligible = canAddProductToCart({ price: product.price, stock: product.stock });
  const addToCartDisabledReason = !isCartReady
    ? 'Готуємо кошик…'
    : product.stock <= 0
      ? 'Додавання недоступне: товару немає в наявності.'
      : !eligible
        ? 'Додавання недоступне: ціна не вказана.'
        : undefined;
  const onAddToCart = () => {
    if (!eligible || product.price === null) return;

    addProduct({
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      quantityInPack: product.quantityInPack,
      stock: product.stock,
      unitPrice: product.price,
    });
    setCartMessage('Товар додано в кошик');
  };

  return {
    cartMessage,
    dismissCartMessage: () => setCartMessage(null),
    pageState: {
      kind: 'ready' as const,
      addToCartDisabled: !eligible || !isCartReady,
      addToCartDisabledReason,
      onAddToCart,
      product,
    },
  };
}
