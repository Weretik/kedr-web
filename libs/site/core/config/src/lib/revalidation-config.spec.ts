import { createRevalidationConfig } from './revalidation-config';

describe('createRevalidationConfig', () => {
  it('turns the refresh off without a secret', () => {
    expect(createRevalidationConfig({})).toEqual({ secret: null });
    expect(createRevalidationConfig({ KEDR_REVALIDATE_SECRET: '  ' })).toEqual({ secret: null });
    expect(createRevalidationConfig({ KEDR_REVALIDATE_SECRET: ' s3cret ' })).toEqual({
      secret: 's3cret',
    });
  });
});
