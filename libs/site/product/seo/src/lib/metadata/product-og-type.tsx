/**
 * `og:type` of a product page. Next.js metadata has no `product` type, so the page renders the tag itself;
 * React places it in the document head.
 */
export function ProductOpenGraphType() {
  return <meta property="og:type" content="product" />;
}
