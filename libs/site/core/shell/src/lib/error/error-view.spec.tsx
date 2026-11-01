import { fireEvent, render, screen } from '@testing-library/react';

import { ErrorView } from './error-view';

vi.mock('next/navigation', () => ({ useParams: () => ({ locale: 'ru' }) }));

describe('ErrorView', () => {
  it('explains the failure in the page language and retries', () => {
    const retry = vi.fn();
    render(<ErrorView retry={retry} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Страница временно недоступна' }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Попробовать еще раз' }));
    expect(retry).toHaveBeenCalled();
  });
});
