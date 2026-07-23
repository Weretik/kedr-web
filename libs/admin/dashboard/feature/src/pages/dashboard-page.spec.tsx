import { render, screen } from '@testing-library/react';

import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  it('renders the dashboard visual composition', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Продажі')).toBeTruthy();
    expect(screen.getByText('Джерела трафіку')).toBeTruthy();
    expect(screen.getByText('Останні товари')).toBeTruthy();
    expect(screen.getByText('Останні замовлення')).toBeTruthy();
  });
});
