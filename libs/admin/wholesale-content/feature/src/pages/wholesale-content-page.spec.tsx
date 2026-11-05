import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WholesaleContentPage } from './wholesale-content-page';

import type { WholesalePage, WholesaleText } from '@admin/wholesale-content/model';

const api = vi.hoisted(() => ({ page: vi.fn(), update: vi.fn() }));

vi.mock('@admin/wholesale-content/data-access', () => ({
  useGetWholesalePageQuery: api.page,
  useUpdateWholesalePageMutation: () => [api.update, { isLoading: false }],
}));

const text = (heroTitle: string): WholesaleText => ({
  heroTitle,
  heroLead: 'Lead',
  contactCardTitle: 'Card',
  contactCardNote: 'Note',
  assortmentTitle: 'Assortment',
  assortmentIntro: 'Intro',
  companyTitle: 'company',
  companyText: 'Company text',
  selectionTitle: 'Selection',
  selectionText: 'selection',
  warehouseTitle: 'Warehouse',
  warehouseText: 'warehouse',
  stepsTitle: 'Steps',
  steps: [1, 2, 3].map((i) => ({ title: `Step ${i}`, text: `Text ${i}` })),
  faqTitle: 'Faq',
  faq: [{ question: 'Q?', answer: 'A.' }],
  closingTitle: 'Closing',
});

const page: WholesalePage = {
  texts: { uk: text('Дверна фурнітура оптом'), ru: text('Дверная фурнитура оптом') },
  updatedAt: '2026-11-05T00:00:00Z',
  updatedBy: null,
};

const resolved = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });

describe('WholesaleContentPage', () => {
  beforeEach(() => {
    api.page
      .mockReset()
      .mockReturnValue({ data: page, isError: false, isLoading: false, refetch: vi.fn() });
    api.update.mockReset();
  });

  it('saves a changed title and an added question in both languages at once', async () => {
    api.update.mockReturnValue(resolved(page));
    render(<WholesaleContentPage />);

    const titles = screen.getAllByRole('textbox', { name: 'Заголовок' });
    fireEvent.change(titles[0], { target: { value: 'Фурнітура оптом' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Додати питання' })[0]);
    const questions = screen.getAllByRole('textbox', { name: 'Питання' });
    const answers = screen.getAllByRole('textbox', { name: 'Відповідь' });
    fireEvent.change(questions[1], { target: { value: 'Нове питання?' } });
    fireEvent.change(answers[1], { target: { value: 'Відповідь.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(api.update).toHaveBeenCalledOnce());
    const draft = api.update.mock.calls[0][0];
    expect(draft.uk.heroTitle).toBe('Фурнітура оптом');
    expect(draft.uk.faq).toHaveLength(2);
    expect(draft.ru.heroTitle).toBe('Дверная фурнитура оптом');
    expect(await screen.findByText(/Тексти збережено/)).toBeDefined();
  });

  it('does not send an empty field and marks the language tab', () => {
    render(<WholesaleContentPage />);

    fireEvent.change(
      screen.getAllByRole('textbox', { hidden: true, name: 'Опис під заголовком' })[1],
      {
        target: { value: ' ' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(api.update).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Русский — є помилки' })).toBeDefined();
  });
});
