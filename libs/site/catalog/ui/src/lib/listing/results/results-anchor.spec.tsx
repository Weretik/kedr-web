import { render, screen } from '@testing-library/react';

import { ResultsAnchor } from './results-anchor';

describe('ResultsAnchor', () => {
  it('scrolls the results heading into view when it mounts', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<ResultsAnchor>Результати пошуку «agb»</ResultsAnchor>);

    expect(screen.getByRole('heading', { name: 'Результати пошуку «agb»' })).toBeTruthy();
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
  });
});
