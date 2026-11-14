import { schedulingErrorMessage } from './scheduling-error-message';

describe('schedulingErrorMessage', () => {
  it('keeps the backend reason of a refused run', () => {
    expect(
      schedulingErrorMessage(
        { code: 'Unknown', status: 409, message: 'Задача вже виконується.' },
        'Не вдалося.',
      ),
    ).toBe('Задача вже виконується.');
  });

  it('names missing rights and falls back for the rest', () => {
    expect(schedulingErrorMessage({ code: 'Forbidden', status: 403 }, 'x')).toBe(
      'Недостатньо прав для цієї дії.',
    );
    expect(
      schedulingErrorMessage({ code: 'Server', status: 500, message: 'boom' }, 'Не вдалося.'),
    ).toBe('Не вдалося.');
  });
});
