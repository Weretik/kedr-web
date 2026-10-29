import { render, screen } from '@testing-library/react';

import { PageIssues } from './page-issues';

describe('PageIssues', () => {
  it('renders nothing without problems and lists several in one alert', () => {
    const { container, rerender } = render(<PageIssues messages={[null, '', false]} />);
    expect(container.textContent).toBe('');

    rerender(<PageIssues messages={['Перша', 'Друга']} title="Замовлення не можна оформити" />);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Замовлення не можна оформити');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
