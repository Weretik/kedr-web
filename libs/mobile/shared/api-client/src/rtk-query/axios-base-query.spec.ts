import { AxiosError, type AxiosInstance } from 'axios';

import { createAxiosBaseQuery } from './axios-base-query';

describe('createAxiosBaseQuery', () => {
  it('returns response data instead of an Axios response object', async () => {
    const request = jest.fn().mockResolvedValue({ data: { id: 'product-1' } });
    const baseQuery = createAxiosBaseQuery({ request } as unknown as AxiosInstance);

    await expect(baseQuery({ url: '/products/product-1' }, {} as never, {})).resolves.toEqual({
      data: { id: 'product-1' },
    });
  });

  it('forwards the RTK Query abort signal to Axios', async () => {
    const request = jest.fn().mockResolvedValue({ data: {} });
    const baseQuery = createAxiosBaseQuery({ request } as unknown as AxiosInstance);
    const controller = new AbortController();

    await baseQuery({ url: '/products' }, { signal: controller.signal } as never, {});

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ signal: controller.signal, url: '/products' }),
    );
  });

  it('returns a shared API error instead of throwing an Axios error', async () => {
    const request = jest.fn().mockRejectedValue(new AxiosError('Network Error'));
    const baseQuery = createAxiosBaseQuery({ request } as unknown as AxiosInstance);

    await expect(baseQuery({ url: '/products' }, {} as never, {})).resolves.toEqual({
      error: {
        code: 'Network',
        message: 'Network Error',
        status: 0,
      },
    });
  });
});
