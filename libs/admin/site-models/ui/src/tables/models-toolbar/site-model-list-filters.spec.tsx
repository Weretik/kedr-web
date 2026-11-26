import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelListFilters } from './site-model-list-filters';

describe('SiteModelListFilters', () => {
  it('picks a status and a problem, and clears them', () => {
    const onStatusChange = vi.fn();
    const onProblemChange = vi.fn();
    const { rerender } = render(
      <SiteModelListFilters
        onProblemChange={onProblemChange}
        onStatusChange={onStatusChange}
        problem={undefined}
        status={undefined}
      />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Статус' }));
    fireEvent.click(screen.getByRole('option', { name: 'Не перевірені' }));
    expect(onStatusChange).toHaveBeenCalledWith('proposed');

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Чого бракує' }));
    fireEvent.click(screen.getByRole('option', { name: 'Значення ознак' }));
    expect(onProblemChange).toHaveBeenCalledWith('missing_axis_value');

    rerender(
      <SiteModelListFilters
        onProblemChange={onProblemChange}
        onStatusChange={onStatusChange}
        problem="model_no_seo"
        status="accepted"
      />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Статус' }));
    fireEvent.click(screen.getByRole('option', { name: 'Усі' }));
    expect(onStatusChange).toHaveBeenLastCalledWith(undefined);
  });
});
