import { applyPageSeo } from './apply-page-seo';

import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Співпраця',
  description: 'Code description',
  alternates: { canonical: '/uk/wholesale' },
  openGraph: { title: 'Співпраця', description: 'Code description', url: '/uk/wholesale' },
};

describe('applyPageSeo', () => {
  it('keeps the code metadata when the editor set nothing', () => {
    expect(applyPageSeo(metadata, undefined)).toBe(metadata);
    expect(applyPageSeo(metadata, { title: null, description: null })).toBe(metadata);
  });

  it('puts the editor title and description in the page and its link preview', () => {
    const result = applyPageSeo(metadata, { title: 'Фурнітура оптом', description: 'Опис' });

    expect(result.title).toBe('Фурнітура оптом');
    expect(result.description).toBe('Опис');
    expect(result.openGraph).toMatchObject({ title: 'Фурнітура оптом', description: 'Опис' });
    expect(result.alternates).toEqual(metadata.alternates);
  });

  it('replaces only what the editor set and keeps an absolute title absolute', () => {
    const home: Metadata = { ...metadata, title: { absolute: 'Class Kedr' } };

    const result = applyPageSeo(home, { title: 'Дверна фурнітура', description: null });

    expect(result.title).toEqual({ absolute: 'Дверна фурнітура' });
    expect(result.description).toBe('Code description');
    expect(result.openGraph).toMatchObject({ description: 'Code description' });
  });
});
