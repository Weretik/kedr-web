import { render, screen } from '@testing-library/react';

import { ChangedNote, formatChanged } from './changed-note';

describe('ChangedNote', () => {
  it('shows when and who, and only when if the editor is unknown', () => {
    render(<ChangedNote at="2026-11-04T17:40:00Z" by="manager@classkedr.com.ua" />);

    expect(screen.getByText(/^Змінено: .+ · manager@classkedr\.com\.ua$/)).toBeTruthy();
    expect(formatChanged('2026-11-04T17:40:00Z', null)).not.toContain('·');
  });
});
