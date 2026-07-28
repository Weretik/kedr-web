import { sanitizeUrl } from './http-logging';

describe('sanitizeUrl', () => {
  it('removes query and fragment values from an absolute URL', () => {
    expect(sanitizeUrl('https://api.example.com/products?email=user@example.com#details')).toBe(
      'https://api.example.com/products',
    );
  });

  it('resolves a relative URL without retaining query values', () => {
    expect(sanitizeUrl('/products?token=secret', 'https://api.example.com/v1')).toBe(
      'https://api.example.com/products',
    );
  });
});
