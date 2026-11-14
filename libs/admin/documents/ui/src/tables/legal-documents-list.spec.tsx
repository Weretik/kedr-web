import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LegalDocumentsList, legalDocumentSiteState } from './legal-documents-list';

const edition = {
  id: 1,
  status: 'published' as const,
  number: 3,
  effectiveFrom: '2026-11-03',
  updatedAt: '2026-11-04T00:00:00Z',
  updatedBy: 'seed',
  publishedAt: '2026-11-04T00:00:00Z',
  publishedBy: 'seed',
};

describe('LegalDocumentsList', () => {
  it('names the edition on the site; delivery has no date', () => {
    expect(legalDocumentSiteState({ kind: 'public-offer', published: edition, draft: null })).toBe(
      'На сайті: редакція №3 від 03.11.2026',
    );
    expect(
      legalDocumentSiteState({ kind: 'delivery-payment', published: edition, draft: null }),
    ).toBe('На сайті: редакція №3');
    expect(legalDocumentSiteState({ kind: 'returns-policy', published: null, draft: null })).toBe(
      'Ще не опубліковано',
    );
  });

  it('opens each document in its editor and marks a waiting draft', () => {
    const onOpen = vi.fn();
    render(
      <LegalDocumentsList
        documents={[
          {
            kind: 'public-offer',
            published: edition,
            draft: { ...edition, id: 2, status: 'draft' },
          },
          { kind: 'privacy-policy', published: edition, draft: null },
        ]}
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Публічна оферта/ }));
    expect(onOpen).toHaveBeenCalledWith('public-offer');
    expect(screen.getAllByText('Є неопублікована чернетка')).toHaveLength(1);
  });
});
