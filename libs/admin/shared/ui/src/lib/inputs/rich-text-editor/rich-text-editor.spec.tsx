import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RichTextEditor } from './rich-text-editor';

describe('RichTextEditor', () => {
  it('renders stored HTML through the schema in read-only mode without a toolbar', () => {
    render(<RichTextEditor label="Опис" readOnly value="<h2>Заголовок</h2><p>Текст</p>" />);

    expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Опис' }).getAttribute('contenteditable')).toBe(
      'false',
    );
  });

  it('takes an outside value without reporting a change back', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <RichTextEditor label="Опис" onChange={onChange} value="<p>Старий</p>" />,
    );

    rerender(<RichTextEditor label="Опис" onChange={onChange} value="<p>Новий</p>" />);

    expect(screen.getByText('Новий')).toBeTruthy();
    expect(onChange.mock.calls).toEqual([]);
  });
});
