import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryProblemsCard } from './category-problems-card';

describe('CategoryProblemsCard', () => {
  it('shows nothing for a complete category (SC-003)', () => {
    const { container } = render(<CategoryProblemsCard onOpenTab={vi.fn()} problems={[]} />);
    expect(container.textContent).toBe('');
  });

  it('opens the tab that fixes a problem', () => {
    const onOpenTab = vi.fn();
    render(
      <CategoryProblemsCard
        onOpenTab={onOpenTab}
        problems={[
          { key: 'textRu', label: 'Немає тексту RU', tab: 'seo' },
          { key: 'noModels', label: 'Немає моделей', tab: 'models' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Немає моделей' }));
    expect(onOpenTab).toHaveBeenCalledWith('models');
    expect(screen.getByRole('heading', { name: 'Що бракує' })).toBeTruthy();
  });
});
