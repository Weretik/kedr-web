import { getProductSitemapIndexResponse } from '@site/product/feature';

export function GET(): Promise<Response> {
  return getProductSitemapIndexResponse();
}
