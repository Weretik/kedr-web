import { getProductDetails } from '@site/product/data-access';
import { renderToStaticMarkup } from 'react-dom/server';

import { productCrumbs } from './product-crumbs';
import { ProductPage } from './product-page';
import { productFixture } from '../../test/product.fixture';

vi.mock('@site/product/data-access', () => ({ getProductDetails: vi.fn() }));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND_404');
  },
  permanentRedirect: (url: string) => {
    throw new Error(`MOVED_308:${url}`);
  },
}));

describe('server product composition', () => {
  it('calls the external purchase renderer with normalized facts and forwards only its node', async () => {
    vi.mocked(getProductDetails).mockResolvedValue({ kind: 'ok', product: productFixture });
    const renderPurchaseAction = vi.fn(() => <button type="button">External purchase</button>);

    const page = await ProductPage({
      locale: 'uk',
      slug: productFixture.slug,
      renderPurchaseAction,
    });
    const html = renderToStaticMarkup(page);

    expect(renderPurchaseAction).toHaveBeenCalledExactlyOnceWith({
      productId: '7',
      title: productFixture.name,
      unitPrice: 245.5,
      currency: 'UAH',
      slug: productFixture.slug,
      imageUrl: productFixture.media[0]!.url,
      available: true,
    });
    expect(html).toContain('External purchase');
    expect(page.props.children[0].props).not.toHaveProperty('renderPurchaseAction');
  });

  it.each([
    { price: null, inStock: true },
    { price: 245.5, inStock: false },
    { price: null, inStock: false },
  ])('preserves contact behavior for price=$price and stock=$inStock', async (facts) => {
    vi.mocked(getProductDetails).mockResolvedValue({
      kind: 'ok',
      product: { ...productFixture, ...facts },
    });
    const renderPurchaseAction = vi.fn(() => <button type="button">External purchase</button>);

    const html = renderToStaticMarkup(
      await ProductPage({ locale: 'uk', slug: productFixture.slug, renderPurchaseAction }),
    );

    expect(renderPurchaseAction).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ productId: '7', unitPrice: facts.price, available: false }),
    );
    expect(html).not.toContain('External purchase');
    expect(html).toContain('href="/uk/contacts"');
  });

  it('keeps the existing disabled purchase fallback when the external renderer declines', async () => {
    vi.mocked(getProductDetails).mockResolvedValue({ kind: 'ok', product: productFixture });
    const html = renderToStaticMarkup(
      await ProductPage({
        locale: 'uk',
        slug: productFixture.slug,
        renderPurchaseAction: () => null,
      }),
    );

    expect(html).toMatch(/<button[^>]*disabled[^>]*>[\s\S]*?У кошик/);
  });

  it('uses catalog root policy and one visible canonical breadcrumb trail', () => {
    const product = {
      ...productFixture,
      breadcrumbs: [
        ...productFixture.breadcrumbs,
        { id: 920000, name: 'Cosmos', slug: 'cosmos' },
        productFixture.breadcrumbs[1]!,
      ],
    };
    const crumbs = productCrumbs('uk', product);
    expect(crumbs.map((crumb) => crumb.href)).toEqual([
      '/uk',
      '/uk/catalog',
      '/uk/catalog/handles',
      '/uk/product/handle-7',
    ]);
    expect(crumbs[crumbs.length - 1]?.name).toBe(productFixture.name);
  });

  it('includes real facts and matching Product/Offer in server output without a simulated cart', async () => {
    vi.mocked(getProductDetails).mockImplementation(async (locale) => ({
      kind: 'ok',
      product: { ...productFixture, name: locale === 'uk' ? 'Дверна ручка' : 'Дверная ручка' },
    }));
    const html = renderToStaticMarkup(
      await ProductPage({ locale: 'uk', slug: productFixture.slug }),
    );
    expect(html).toContain('<h1');
    expect(html).toContain(productFixture.name);
    expect(html).toContain('245');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('href="/uk/catalog/handles"');
    const data = JSON.parse(
      html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]!,
    );
    expect(data[0]).toMatchObject({
      name: productFixture.name,
      sku: '7',
      offers: { price: 245.5 },
    });
    expect(data[1].itemListElement.at(-1).item).toContain('/uk/product/handle-7');
    expect(html).not.toContain('DEMO-001');
  });

  it('keeps no-stock and no-price facts together in HTML without a zero Offer', async () => {
    vi.mocked(getProductDetails).mockResolvedValue({
      kind: 'ok',
      product: { ...productFixture, price: null, inStock: false, media: [] },
    });
    const html = renderToStaticMarkup(
      await ProductPage({ locale: 'uk', slug: productFixture.slug }),
    );
    expect(html).toContain('Немає в наявності');
    expect(html).toContain('Ціна за запитом');
    expect(html).toContain('/uk/contacts');
    const data = JSON.parse(
      html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]!,
    );
    expect(data[0]).not.toHaveProperty('offers');
  });
});
