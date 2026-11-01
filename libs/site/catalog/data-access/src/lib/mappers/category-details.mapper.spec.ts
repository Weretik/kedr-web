import { mapCategoryDetails, readRedirectSlug } from './category-details.mapper';

const content = {
  seoTitle: ' Завіси ',
  metaDescription: null,
  h1: '',
  bodyHtml: '<p>Text</p>',
  faq: [
    { question: ' Q? ', answer: ' A ' },
    { question: ' ', answer: 'skipped' },
  ],
  updatedAt: '2026-10-30T00:00:00Z',
};

const details = {
  id: 9,
  slug: 'zavisy',
  name: ' Завіси ',
  parentId: 1,
  sortOrder: 1,
  level: 1,
  productCount: 42,
  children: [
    {
      id: 10,
      slug: 'dvernye',
      name: 'Дверні',
      parentId: 9,
      sortOrder: 1,
      level: 2,
      productCount: 5,
      children: [],
    },
  ],
  breadcrumbs: [
    { id: 5513, slug: 'furnitura', name: ' Фурнітура ' },
    { id: 0, slug: '', name: 'broken' },
    { id: 1, slug: 'zamky', name: ' Замки ' },
    { id: 9, slug: 'zavisy', name: 'Завіси' },
  ],
  minPrice: 0,
  maxPrice: 980,
  content,
};

describe('mapCategoryDetails', () => {
  it('maps a category with trimmed text, valid breadcrumbs without «Фурнітура», children, and positive prices', () => {
    expect(mapCategoryDetails(details)).toEqual({
      id: 9,
      slug: 'zavisy',
      name: 'Завіси',
      productCount: 42,
      breadcrumbs: [
        { id: 1, slug: 'zamky', name: 'Замки' },
        { id: 9, slug: 'zavisy', name: 'Завіси' },
      ],
      children: [{ id: 10, slug: 'dvernye', name: 'Дверні', productCount: 5, children: [] }],
      minPrice: null,
      maxPrice: 980,
      content: {
        seoTitle: 'Завіси',
        metaDescription: null,
        h1: null,
        bodyHtml: '<p>Text</p>',
        faq: [{ question: 'Q?', answer: 'A' }],
      },
    });
  });

  it('treats blank content as no content', () => {
    const blank = { ...content, seoTitle: ' ', bodyHtml: null, faq: [] };

    expect(mapCategoryDetails({ ...details, content: blank }).content).toBeNull();
    expect(mapCategoryDetails({ ...details, content: null }).content).toBeNull();
  });
});

describe('readRedirectSlug', () => {
  it('reads a category redirect from a 404 body', () => {
    expect(readRedirectSlug({ redirectSlug: 'furnitura', redirectType: 'category' })).toBe(
      'furnitura',
    );
  });

  it('ignores anything else', () => {
    expect(readRedirectSlug(undefined)).toBeNull();
    expect(readRedirectSlug('furnitura')).toBeNull();
    expect(readRedirectSlug({ redirectSlug: 'x', redirectType: 'product' })).toBeNull();
    expect(readRedirectSlug({ redirectSlug: ' ', redirectType: 'category' })).toBeNull();
  });
});
