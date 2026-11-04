import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LegalDocumentEditorPage } from './legal-document-editor-page';

import type { LegalDocumentOverview, LegalDocumentVersion } from '@admin/documents/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  version: vi.fn(),
  versions: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  publish: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('@admin/documents/data-access', () => ({
  useGetLegalDocumentsQuery: api.list,
  useGetLegalDocumentVersionQuery: api.version,
  useGetLegalDocumentVersionsQuery: api.versions,
  useCreateLegalDocumentDraftMutation: () => [api.create, { isLoading: false }],
  useUpdateLegalDocumentDraftMutation: () => [api.update, { isLoading: false }],
  usePublishLegalDocumentDraftMutation: () => [api.publish, { isLoading: false }],
  useDeleteLegalDocumentDraftMutation: () => [api.remove, { isLoading: false }],
}));

const summary = {
  id: 1,
  status: 'published' as const,
  number: 1,
  effectiveFrom: '2026-11-03',
  updatedAt: '2026-11-04T00:00:00Z',
  updatedBy: 'seed',
  publishedAt: '2026-11-04T00:00:00Z',
  publishedBy: 'seed',
};

const published = (kind: LegalDocumentVersion['kind']): LegalDocumentVersion => ({
  ...summary,
  kind,
  texts: {
    uk: { title: 'Публічна оферта', bodyHtml: '<h2>Загальні</h2><p>Текст</p>' },
    ru: { title: 'Публичная оферта', bodyHtml: '<h2>Общие</h2><p>Текст</p>' },
  },
});

const ok = <T,>(data: T) => ({ data, isLoading: false, isError: false, refetch: vi.fn() });

function open(kind: LegalDocumentVersion['kind']) {
  const overview: LegalDocumentOverview[] = [{ kind, published: summary, draft: null }];
  api.list.mockReturnValue(ok(overview));
  api.version.mockImplementation((id: number) => ok(id === 1 ? published(kind) : undefined));
  api.versions.mockReturnValue(ok([summary]));
  render(
    <MemoryRouter initialEntries={[`/documents/${kind}`]}>
      <Routes>
        <Route element={<LegalDocumentEditorPage />} path="/documents/:kind" />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LegalDocumentEditorPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('starts from the text on the site and publishes a change with «Редакція від»', async () => {
    const draft = {
      ...published('public-offer'),
      id: 2,
      status: 'draft' as const,
      number: null,
      effectiveFrom: null,
    };
    api.create.mockReturnValue({ unwrap: () => Promise.resolve(draft) });
    api.publish.mockReturnValue({
      unwrap: () => Promise.resolve({ ...draft, status: 'published' }),
    });
    open('public-offer');

    expect(screen.getByText('На сайті: редакція №1 від 03.11.2026')).toBeTruthy();
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Назва' })[0], {
      target: { value: 'Публічна оферта (нова)' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Опублікувати' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Редакція від'), {
      target: { value: '2026-11-10' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Опублікувати' }));

    await waitFor(() =>
      expect(api.publish).toHaveBeenCalledWith({
        kind: 'public-offer',
        id: 2,
        effectiveFrom: '2026-11-10',
      }),
    );
    expect(api.create.mock.calls[0][0].draft.texts.uk.title).toBe('Публічна оферта (нова)');
  });

  it('does not let the date go before the edition on the site', () => {
    open('privacy-policy');

    fireEvent.change(screen.getAllByRole('textbox', { name: 'Назва' })[0], {
      target: { value: 'Інша' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Опублікувати' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Редакція від'), {
      target: { value: '2026-11-01' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Опублікувати' }));

    expect(
      within(dialog).getByText('Не раніше за дату чинної редакції (03.11.2026).'),
    ).toBeTruthy();
    expect(api.create).not.toHaveBeenCalled();
  });

  it('publishes delivery & payment without asking for a date', () => {
    open('delivery-payment');

    expect(screen.getByText('На сайті: редакція №1')).toBeTruthy();
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Назва' })[0], {
      target: { value: 'Доставка' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Опублікувати' }));

    expect(within(screen.getByRole('dialog')).queryByLabelText('Редакція від')).toBeNull();
  });

  it('keeps Publish off until something changes', () => {
    open('returns-policy');

    expect(screen.getByRole('button', { name: 'Опублікувати' }).hasAttribute('disabled')).toBe(
      true,
    );
    expect(screen.getByText('Історія редакцій (1)')).toBeTruthy();
  });
});
