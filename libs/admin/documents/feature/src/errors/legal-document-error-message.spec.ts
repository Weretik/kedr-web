import { legalDocumentErrorMessage } from './legal-document-error-message';

describe('legalDocumentErrorMessage', () => {
  it.each([
    [{ code: 'Forbidden' }, 'Недостатньо прав для цієї дії.'],
    [
      { code: 'Unknown', status: 409 },
      'Документ щойно змінив інший користувач. Оновіть сторінку й повторіть.',
    ],
    [
      { code: 'Validation', fieldErrors: { effectiveFrom: ['too early'] } },
      'Дата редакції раніша за чинну. Вкажіть пізнішу.',
    ],
    [
      { code: 'Validation', fieldErrors: { 'texts[0].title': ['x'] } },
      'Сервер не прийняв текст. Перевірте обидві мови.',
    ],
    [new Error('network'), 'Не вдалося зберегти. Спробуйте ще раз.'],
  ])('maps %o', (error, message) => {
    expect(legalDocumentErrorMessage(error)).toBe(message);
  });
});
