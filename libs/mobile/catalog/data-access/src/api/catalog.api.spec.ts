import { catalogApi } from './catalog.api';

jest.mock('@mobile/shared/api-client', () => ({
  baseApi: {
    injectEndpoints: ({
      endpoints,
    }: {
      endpoints: (build: unknown) => Record<string, unknown>;
    }) => {
      const build = { query: (definition: unknown) => definition };
      const definitions = endpoints(build);

      return {
        endpoints: definitions,
        useGetCatalogCategoriesQuery: jest.fn(),
        useGetCatalogProductDetailsQuery: jest.fn(),
        useGetCatalogProductsQuery: jest.fn(),
        useGetMissingPhotoProductsQuery: jest.fn(),
      };
    },
  },
}));

describe('getMissingPhotoProducts endpoint', () => {
  it('wires the canonical request, runtime mapping and isolated cache tags', () => {
    const endpoint = endpointDefinition();

    expect(endpoint.query({ page: 2 })).toEqual({
      method: 'GET',
      params: { page: 2, pageSize: 20 },
      url: '/api/admin/products/missing-photos',
    });

    const mapped = endpoint.transformResponse(validResponse());
    expect(mapped.items).toEqual([
      expect.objectContaining({ id: '12', imageUrl: null, productSlug: 'kabel-12' }),
    ]);
    expect(endpoint.providesTags(mapped)).toEqual([
      { id: 'MISSING_PHOTOS', type: 'Catalog' },
      { id: '12', type: 'Catalog' },
    ]);

    const firstPageKey = endpoint.serializeQueryArgs({
      endpointName: 'getMissingPhotoProducts',
      queryArgs: { page: 1 },
    });
    expect(
      endpoint.serializeQueryArgs({
        endpointName: 'getMissingPhotoProducts',
        queryArgs: { page: 2 },
      }),
    ).toBe(firstPageKey);
    expect(
      endpoint.serializeQueryArgs({ endpointName: 'getCatalogProducts', queryArgs: { page: 1 } }),
    ).not.toBe(firstPageKey);
  });
});

function endpointDefinition() {
  return (
    catalogApi as unknown as {
      endpoints: {
        getMissingPhotoProducts: EndpointDefinition;
      };
    }
  ).endpoints.getMissingPhotoProducts;
}

interface EndpointDefinition {
  providesTags: (result: ReturnType<EndpointDefinition['transformResponse']>) => unknown;
  query: (query: { page: number }) => unknown;
  serializeQueryArgs: (context: { endpointName: string; queryArgs: { page: number } }) => string;
  transformResponse: (response: unknown) => {
    items: Array<{ id: string; imageUrl: string | null; productSlug: string }>;
  };
}

function validResponse() {
  return {
    pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
    value: [
      {
        categoryId: null,
        categoryName: '',
        exportToSite: true,
        id: 12,
        inStock: true,
        isNew: false,
        isSale: false,
        nameRu: 'Кабель',
        nameUk: 'Кабель',
        photo: '',
        photoAvailable: false,
        photoCheckedAtUtc: '2026-10-05T10:00:00.000Z',
        photoHttpStatusCode: null,
        photoStatus: 'Missing',
        price: 120,
        productSlug: 'kabel-12',
        quantityInPack: 1,
        stock: 3,
      },
    ],
  };
}
