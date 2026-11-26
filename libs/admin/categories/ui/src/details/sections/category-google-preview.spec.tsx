import { categoryGooglePreview } from '@admin/categories/model';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CategoryGooglePreview } from './category-google-preview';

const preview = (seoTitle: string, metaDescription: string) =>
  categoryGooglePreview({
    siteUrl: 'https://classkedr.com.ua',
    language: 'uk',
    slug: 'zamky',
    seoTitle,
    metaDescription,
  });

describe('CategoryGooglePreview', () => {
  it('shows the address, title and description as Google would (SC-005)', () => {
    render(<CategoryGooglePreview preview={preview('Замки | ClassKedr', 'Купити замки')} />);

    expect(screen.getByText('classkedr.com.ua › uk › catalog › zamky')).toBeTruthy();
    expect(screen.getByText('Замки | ClassKedr')).toBeTruthy();
    expect(screen.getByText('Купити замки')).toBeTruthy();
    expect(screen.queryByText(/обріже/)).toBeNull();
  });

  it('says when the site builds the texts and when Google cuts them', () => {
    render(<CategoryGooglePreview preview={preview('А'.repeat(80), '')} />);

    expect(
      screen.getByText('Сайт складе сам з назви категорії, кількості товарів і ціни.'),
    ).toBeTruthy();
    expect(screen.getByText('Заголовок задовгий: Google обріже його.')).toBeTruthy();
  });
});
