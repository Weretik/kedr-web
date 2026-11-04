import { newArticleDraft } from '@admin/articles/model';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArticleForm } from './article-form';

const props = {
  dirty: false,
  isNew: true,
  onChange: vi.fn(),
  onReset: vi.fn(),
  onSave: vi.fn(),
  saving: false,
};

describe('ArticleForm', () => {
  it('builds the address from the title for a new article and saves on submit', () => {
    const onSave = vi.fn();
    render(<ArticleForm {...props} draft={newArticleDraft()} onSave={onSave} />);
    expect(screen.getByText(/Порожньо — з українського заголовка/)).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Скасувати зміни' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Створити статтю' }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('marks a language with errors and keeps both panes mounted', () => {
    render(
      <ArticleForm
        {...props}
        draft={newArticleDraft()}
        errors={{ texts: { ru: { title: 'Вкажіть заголовок.' } } }}
        isNew={false}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Українська' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Русский — є помилки' })).toBeDefined();
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(2);
    expect((screen.getByRole('button', { name: 'Зберегти' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('changes publishing for both languages at once', () => {
    const onChange = vi.fn();
    render(<ArticleForm {...props} draft={newArticleDraft()} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch', { name: 'Показувати на сайті' }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ isPublished: true }));
  });
});
