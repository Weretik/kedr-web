import { renderToStaticMarkup } from 'react-dom/server';

import { ProductOpenGraphType } from './product-og-type';

describe('ProductOpenGraphType', () => {
  it('marks the page as a product for link previews', () => {
    expect(renderToStaticMarkup(<ProductOpenGraphType />)).toBe(
      '<meta property="og:type" content="product"/>',
    );
  });
});
