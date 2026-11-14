import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FaqListEditor } from './faq-list-editor';

const items = [
  { question: 'Перше?', answer: 'Так.' },
  { question: 'Друге?', answer: 'Ні.' },
];

describe('FaqListEditor', () => {
  it('adds, moves, and removes questions', () => {
    const onChange = vi.fn();
    render(<FaqListEditor items={items} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Додати питання' }));
    expect(onChange).toHaveBeenLastCalledWith([...items, { question: '', answer: '' }]);

    fireEvent.click(screen.getByRole('button', { name: 'Перемістити питання 2 вище' }));
    expect(onChange).toHaveBeenLastCalledWith([items[1], items[0]]);

    fireEvent.click(screen.getByRole('button', { name: 'Видалити питання 1' }));
    expect(onChange).toHaveBeenLastCalledWith([items[1]]);

    expect(
      (screen.getByRole('button', { name: 'Перемістити питання 1 вище' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it('shows item errors', () => {
    render(
      <FaqListEditor
        errors={{ faqItems: [{ question: 'Вкажіть питання.' }] }}
        items={[{ question: '', answer: 'A' }]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Вкажіть питання/)).toBeTruthy();
  });
});
