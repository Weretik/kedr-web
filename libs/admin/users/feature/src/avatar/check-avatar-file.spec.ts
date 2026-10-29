import { checkAvatarFile } from './check-avatar-file';

const file = (type: string, size: number) =>
  new File([new Uint8Array(Math.min(size, 16))], 'photo', { type });

describe('checkAvatarFile', () => {
  it('rejects a file over 2 MB before decoding it', async () => {
    const large = file('image/jpeg', 10);
    Object.defineProperty(large, 'size', { value: 3 * 1024 * 1024 });

    expect(await checkAvatarFile(large)).toBe('Фото завелике: 3 МБ. Максимум — 2 МБ.');
  });

  it('rejects other formats', async () => {
    expect(await checkAvatarFile(file('image/gif', 10))).toContain('JPG, PNG або WebP');
  });

  it('leaves the size check to the server when the browser cannot decode', async () => {
    expect(await checkAvatarFile(file('image/png', 10))).toBeUndefined();
  });
});
