import { describe, expect, it } from 'vitest';

import { categoryGooglePreview } from './category-google-preview';

const base = {
  siteUrl: 'https://classkedr.com.ua/',
  language: 'uk' as const,
  slug: 'zamky',
  seoTitle: 'Замки | ClassKedr',
  metaDescription: 'Опис',
};

describe('categoryGooglePreview', () => {
  it('builds the address and keeps short texts as they are', () => {
    expect(categoryGooglePreview(base)).toEqual({
      address: 'classkedr.com.ua › uk › catalog › zamky',
      title: 'Замки | ClassKedr',
      description: 'Опис',
      titleCut: false,
      descriptionCut: false,
    });
  });

  it('cuts where Google cuts and leaves empty texts to the site', () => {
    const preview = categoryGooglePreview({
      ...base,
      language: 'ru',
      seoTitle: 'А'.repeat(70),
      metaDescription: '  ',
    });
    expect(preview.address).toBe('classkedr.com.ua › ru › catalog › zamky');
    expect(preview.title).toHaveLength(60);
    expect(preview.title?.endsWith('…')).toBe(true);
    expect(preview.titleCut).toBe(true);
    expect(preview.description).toBeNull();
  });
});
