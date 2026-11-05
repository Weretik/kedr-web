import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AttentionList } from './attention-list';

import type { AttentionItem } from '@admin/dashboard/model';

const item = (kind: AttentionItem['kind'], title: string): AttentionItem => ({
  kind,
  tone: 'note',
  title,
  detail: null,
  href: `/${kind}`,
  actionLabel: `Відкрити ${title}`,
});

describe('AttentionList', () => {
  it('renders nothing without problems', () => {
    const { container } = render(<AttentionList items={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows four rows in full and the rest as short links', () => {
    render(
      <AttentionList
        items={[
          item('sync', 'Перша'),
          item('photos', 'Друга'),
          item('category-texts', 'Третя'),
          item('article-drafts', 'Четверта'),
          item('document-drafts', 'П’ята'),
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Відкрити Перша' }).getAttribute('href')).toBe('/sync');
    expect(screen.getByRole('link', { name: 'П’ята' }).getAttribute('href')).toBe(
      '/document-drafts',
    );
  });
});
