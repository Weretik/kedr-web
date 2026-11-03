import type { Locale } from '@site/core/i18n';

export const ARTICLES_SEO_COPY: Record<
  Locale,
  {
    home: string;
    title: string;
    description: string;
    searchTitle: string;
    page: string;
  }
> = {
  uk: {
    home: 'Головна',
    title: 'Статті',
    description:
      'Статті про дверну фурнітуру: ручки, замки, завіси, матеріали та вибір комплектуючих.',
    searchTitle: 'Пошук статей',
    page: 'сторінка',
  },
  ru: {
    home: 'Главная',
    title: 'Статьи',
    description:
      'Статьи о дверной фурнитуре: ручки, замки, петли, материалы и выбор комплектующих.',
    searchTitle: 'Поиск статей',
    page: 'страница',
  },
};
