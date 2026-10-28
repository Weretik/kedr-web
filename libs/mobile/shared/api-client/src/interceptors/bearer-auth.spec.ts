import axios, { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';

import { installBearerAuth } from './bearer-auth';
import { configureMobileAuth } from '../auth/mobile-auth-adapter';

const respond = (config: InternalAxiosRequestConfig, status: number) => {
  const response = { config, data: { ok: status < 400 }, headers: {}, status, statusText: '' };
  if (status >= 400) {
    throw new AxiosError('failed', String(status), config, undefined, response);
  }
  return response;
};

function createClient(statusFor: (authorization: string | undefined) => number) {
  const seenTokens: (string | undefined)[] = [];
  const adapter: AxiosAdapter = async (config) => {
    const authorization = config.headers?.['Authorization'] as string | undefined;
    seenTokens.push(authorization);
    return respond(config, statusFor(authorization));
  };
  const client = axios.create({ adapter });
  installBearerAuth(client);
  return { client, seenTokens };
}

describe('installBearerAuth', () => {
  afterEach(() => configureMobileAuth(undefined));

  it('sends the access token', async () => {
    configureMobileAuth({
      getAccessToken: () => 'a1',
      onUnauthenticated: jest.fn(),
      refreshAccessToken: jest.fn(),
    });
    const { client, seenTokens } = createClient(() => 200);

    await client.get('/api/admin/orders');

    expect(seenTokens).toEqual(['Bearer a1']);
  });

  it('refreshes once on 401 and repeats the request', async () => {
    let token = 'expired';
    const refreshAccessToken = jest.fn(async () => {
      token = 'fresh';
      return token;
    });
    configureMobileAuth({
      getAccessToken: () => token,
      onUnauthenticated: jest.fn(),
      refreshAccessToken,
    });
    const { client, seenTokens } = createClient((authorization) =>
      authorization === 'Bearer fresh' ? 200 : 401,
    );

    const response = await client.get('/api/admin/orders');

    expect(response.status).toBe(200);
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(seenTokens).toEqual(['Bearer expired', 'Bearer fresh']);
  });

  it('ends the session when the refresh fails', async () => {
    const onUnauthenticated = jest.fn();
    configureMobileAuth({
      getAccessToken: () => 'expired',
      onUnauthenticated,
      refreshAccessToken: jest.fn().mockResolvedValue(null),
    });
    const { client } = createClient(() => 401);

    await expect(client.get('/api/admin/orders')).rejects.toBeInstanceOf(AxiosError);
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it('leaves sign-in requests alone', async () => {
    const refreshAccessToken = jest.fn();
    configureMobileAuth({
      getAccessToken: () => 'a1',
      onUnauthenticated: jest.fn(),
      refreshAccessToken,
    });
    const { client, seenTokens } = createClient(() => 401);

    await expect(client.post('/api/auth/mobile/login', {})).rejects.toBeInstanceOf(AxiosError);
    expect(seenTokens).toEqual([undefined]);
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });
});
