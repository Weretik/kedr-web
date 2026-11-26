import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryNewPanel } from './category-new-panel';

const draft = { nameUk: '', nameRu: 'Накладные', parentId: 1, isShownOnSite: true };
const options = [
  { id: null, label: 'Верхній рівень', path: '' },
  { id: 1, label: 'Ручки', path: 'Ручки' },
];

describe('CategoryNewPanel', () => {
  it('asks for the names after «Створити» and shows the chosen parent (SC-001)', () => {
    const onSubmit = vi.fn();
    render(
      <CategoryNewPanel
        draft={draft}
        error="Категорія з такою назвою вже є тут."
        onChange={vi.fn()}
        onClose={vi.fn()}
        onParentChange={vi.fn()}
        onSubmit={onSubmit}
        open
        options={options}
        saving={false}
        showErrors
      />,
    );

    expect(screen.getByText('Вкажіть назву.')).toBeTruthy();
    expect(screen.getByDisplayValue('Ручки')).toBeTruthy();
    expect(screen.getByText('Категорія з такою назвою вже є тут.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
