import type { Locale } from '@site/core/i18n';

export const ARTICLES_SEO_COPY: Record<
  Locale,
  {
    home: string;
    title: string;
    /** The list's search title: names the subject, unlike the short breadcrumb `title`. */
    listTitle: string;
    description: string;
    searchTitle: string;
    page: string;
  }
> = {
  uk: {
    home: 'Головна',
    title: 'Статті',
    listTitle: 'Статті про дверну фурнітуру',
    description:
      'Статті про дверну фурнітуру: ручки, замки, завіси, матеріали та вибір комплектуючих.',
    searchTitle: 'Пошук статей',
    page: 'сторінка',
  },
  ru: {
    home: 'Главная',
    title: 'Статьи',
    listTitle: 'Статьи о дверной фурнитуре',
    description:
      'Статьи о дверной фурнитуре: ручки, замки, петли, материалы и выбор комплектующих.',
    searchTitle: 'Поиск статей',
    page: 'страница',
  },
};
