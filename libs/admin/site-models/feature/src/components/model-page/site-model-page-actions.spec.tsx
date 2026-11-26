import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelPageActions } from './site-model-page-actions';

describe('SiteModelPageActions', () => {
  it('offers «Погодити» for a proposal and «Редагувати»', () => {
    const onAccept = vi.fn();
    const onEdit = vi.fn();
    render(<SiteModelPageActions busy={false} onAccept={onAccept} onEdit={onEdit} proposed />);
    fireEvent.click(screen.getByRole('button', { name: 'Погодити' }));
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));
    expect(onAccept).toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalled();
  });

  it('has no «Погодити» for an accepted model', () => {
    render(
      <SiteModelPageActions busy={false} onAccept={vi.fn()} onEdit={vi.fn()} proposed={false} />,
    );
    expect(screen.queryByRole('button', { name: 'Погодити' })).toBeNull();
  });
});
