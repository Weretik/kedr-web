import type { BasketProps, CheckoutViewProps } from '../types/cart-ui-props';

export function basketFixture(overrides: Partial<BasketProps> = {}): BasketProps {
  const locale = overrides.locale ?? 'uk';
  return {
    locale,
    lines: [
      {
        variantId: '7',
        quantity: 2,
        productHref: `/${locale}/product/handle-7`,
        snapshot: {
          title: 'Дверна ручка',
          slug: 'handle-7',
          unitPrice: 245.5,
          currency: 'UAH',
          imageUrl: 'https://images-kedr.cdn.express/handle.jpg',
        },
      },
      {
        variantId: '12',
        quantity: 3,
        productHref: null,
        snapshot: { title: 'Завіса', slug: '', unitPrice: 80, currency: 'UAH' },
      },
    ],
    restoring: false,
    pending: false,
    recovery: null,
    onChangeQuantity: () => undefined,
    onRemove: () => undefined,
    onAcceptRecovery: () => undefined,
    onDiscardRecovery: () => undefined,
    ...overrides,
  };
}

export function checkoutFixture(overrides: Partial<CheckoutViewProps> = {}): CheckoutViewProps {
  return {
    ...basketFixture(),
    draft: { firstName: 'Олена', phone: '+38 (068) 713-50-49' },
    fieldErrors: {},
    formMessages: [],
    resultKind: null,
    receipt: null,
    canSubmit: true,
    phone: { display: '(067) 111-22-33', e164: '+380671112233' },
    onDraftChange: () => undefined,
    onFieldBlur: () => undefined,
    onSubmit: () => undefined,
    ...overrides,
  };
}
