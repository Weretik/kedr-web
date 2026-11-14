import { apiClient } from '@mobile/shared/api-client';
import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';

import { fetchSnapshot } from './snapshot-client';

jest.mock('@mobile/shared/api-client', () => ({ apiClient: { get: jest.fn() } }));

const get = apiClient.get as jest.Mock;

const response = (status: number, data: unknown, etag?: string): AxiosResponse => ({
  status,
  statusText: '',
  data,
  headers: etag ? { etag } : {},
  config: { headers: new AxiosHeaders() },
});

describe('fetchSnapshot', () => {
  afterEach(() => get.mockReset());

  it('sends If-None-Match and reads the new ETag', async () => {
    get.mockResolvedValue(response(200, { version: 'v2' }, '"v2"'));

    const result = await fetchSnapshot('catalog', '"v1"');

    expect(get).toHaveBeenCalledWith(
      '/api/mobile/sync/catalog',
      expect.objectContaining({ headers: { 'If-None-Match': '"v1"' } }),
    );
    expect(result).toEqual({ kind: 'updated', etag: '"v2"', body: { version: 'v2' } });
  });

  it('treats 304 as not modified', async () => {
    get.mockResolvedValue(response(304, ''));

    await expect(fetchSnapshot('customers', '"v1"')).resolves.toEqual({ kind: 'not-modified' });
  });

  it('maps no response to offline and 403 to unauthorized', async () => {
    get.mockRejectedValueOnce(new AxiosError('Network Error'));
    await expect(fetchSnapshot('catalog', null)).resolves.toEqual({
      kind: 'failed',
      reason: 'offline',
    });

    get.mockRejectedValueOnce(
      new AxiosError('Forbidden', '403', undefined, undefined, response(403, null)),
    );
    await expect(fetchSnapshot('catalog', null)).resolves.toEqual({
      kind: 'failed',
      reason: 'unauthorized',
    });
  });
});
