import { mediaErrorMessage } from './media-error-message';

describe('mediaErrorMessage', () => {
  it('words a conflict for the action that caused it', () => {
    expect(mediaErrorMessage({ status: 409 }, 'deleteFolder')).toMatch(/не порожня/);
    expect(mediaErrorMessage({ status: 409 }, 'saveFolder')).toMatch(/уже є/);
  });

  it('shows the backend picture reasons in Ukrainian', () => {
    const notPicture = {
      code: 'Validation',
      fieldErrors: { file: ['The file must be a JPEG, PNG, or WebP picture.'] },
    };
    expect(mediaErrorMessage(notPicture, 'upload')).toBe('Підходять лише фото JPEG, PNG або WebP.');
    expect(mediaErrorMessage({ status: 503 }, 'upload')).toMatch(/не налаштоване/);
    expect(mediaErrorMessage({ code: 'Forbidden', status: 403 }, 'deleteFile')).toBe(
      'Недостатньо прав для цієї дії.',
    );
  });
});
