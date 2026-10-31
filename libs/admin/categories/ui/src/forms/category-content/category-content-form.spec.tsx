import { emptyCategoryContent } from '@admin/categories/model';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryContentForm } from './category-content-form';
import { CategoryContentView } from '../../details/category-content-view';

describe('CategoryContentForm', () => {
  it('counts characters and saves only when there are changes', () => {
    const onChange = vi.fn();
    const onSave = vi.fn();
    const draft = { ...emptyCategoryContent('uk'), seoTitle: 'Завіси' };
    const { rerender } = render(
      <CategoryContentForm
        dirty={false}
        draft={draft}
        onChange={onChange}
        onReset={vi.fn()}
        onSave={onSave}
        saving={false}
      />,
    );

    expect(screen.getByText(/6 \/ 70/)).toBeTruthy();
    expect(screen.getByRole('toolbar', { name: 'Форматування тексту' })).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Зберегти' }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    fireEvent.change(screen.getByLabelText('SEO-заголовок (title)'), {
      target: { value: 'Дверні завіси' },
    });
    expect(onChange).toHaveBeenCalledWith({ ...draft, seoTitle: 'Дверні завіси' });

    rerender(
      <CategoryContentForm
        dirty
        draft={draft}
        onChange={onChange}
        onReset={vi.fn()}
        onSave={onSave}
        saving={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(onSave).toHaveBeenCalled();
  });
});

describe('CategoryContentView', () => {
  it('shows stored values without edit controls', () => {
    render(
      <CategoryContentView
        content={{
          ...emptyCategoryContent('uk'),
          bodyHtml: '<h2>Як обрати</h2><p>Текст</p>',
          faq: [{ question: 'Питання?', answer: 'Відповідь.' }],
          h1: 'Дверні завіси',
        }}
      />,
    );

    expect(screen.getByText('Дверні завіси')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Як обрати' })).toBeTruthy();
    expect(screen.getByText('Питання?')).toBeTruthy();
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Зберегти' })).toBeNull();
  });
});
