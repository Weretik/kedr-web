export function toProductDetailsRequest(productSlug: string) {
  return {
    method: 'GET' as const,
    params: { priceTypeId: 11 },
    url: `/api/catalog/uk/product/${encodeURIComponent(productSlug)}`,
  };
}
