import { validateAvatarDimensions, validateAvatarFile } from './avatar-file-rules';

describe('validateAvatarFile', () => {
  it('accepts JPEG, PNG and WebP up to 2 MB', () => {
    expect(validateAvatarFile({ type: 'image/jpeg', size: 2 * 1024 * 1024 })).toBeUndefined();
    expect(validateAvatarFile({ type: 'image/png', size: 1000 })).toBeUndefined();
    expect(validateAvatarFile({ type: 'image/webp', size: 1000 })).toBeUndefined();
  });

  it('names the size and the limit for a large file', () => {
    expect(validateAvatarFile({ type: 'image/jpeg', size: 3.4 * 1024 * 1024 })).toBe(
      'Фото завелике: 3,4 МБ. Максимум — 2 МБ.',
    );
  });

  it('rejects other formats', () => {
    expect(validateAvatarFile({ type: 'image/gif', size: 1000 })).toBe(
      'Підходять лише фото у форматі JPG, PNG або WebP.',
    );
  });
});

describe('validateAvatarDimensions', () => {
  it('rejects an image smaller than 128 px on a side', () => {
    expect(validateAvatarDimensions({ width: 400, height: 100 })).toContain('400×100');
    expect(validateAvatarDimensions({ width: 128, height: 128 })).toBeUndefined();
  });
});
