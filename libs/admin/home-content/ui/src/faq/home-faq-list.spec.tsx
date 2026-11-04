import { fireEvent, render, screen } from '@testing-library/react';

import { HomeFaqList } from './home-faq-list';

import type { HomeFaqItem } from '@admin/home-content/model';

const item = (id: number, question: string): HomeFaqItem => ({
  id,
  position: id,
  texts: { questionUk: question, questionRu: question, answerUk: 'Так.', answerRu: 'Да.' },
  updatedAt: '2026-11-04T00:00:00Z',
});

const handlers = () => ({ onAdd: vi.fn(), onEdit: vi.fn(), onMove: vi.fn(), onRemove: vi.fn() });

describe('HomeFaqList', () => {
  it('moves a question and blocks the first one from going up', () => {
    const props = handlers();
    const items = [item(1, 'Перше?'), item(2, 'Друге?')];
    render(<HomeFaqList items={items} loading={false} reordering={false} {...props} />);

    expect(
      (screen.getByRole('button', { name: 'Перемістити «Перше?» вище' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Перемістити «Друге?» вище' }));
    fireEvent.click(screen.getByRole('button', { name: 'Видалити «Перше?»' }));

    expect(props.onMove).toHaveBeenCalledWith(items[1], 0);
    expect(props.onRemove).toHaveBeenCalledWith(items[0]);
  });

  it('explains that an empty list hides the block on the site', () => {
    const props = handlers();
    render(<HomeFaqList items={[]} loading={false} reordering={false} {...props} />);

    expect(screen.getByText(/блок «Часті запитання» на головній не показується/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Додати питання' }));
    expect(props.onAdd).toHaveBeenCalled();
  });
});
