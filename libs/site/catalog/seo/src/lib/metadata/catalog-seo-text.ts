import type { Locale, PluralForms } from '@site/core/i18n';

type CatalogSeoText = {
  categoryTitle: (name: string) => string;
  categoryDescription: (name: string, count: string, minPrice: string | null) => string;
  pageSuffix: (page: number) => string;
  products: PluralForms;
  hubTitle: string;
  hubDescription: string;
  searchTitle: (term: string) => string;
  searchEmptyTitle: string;
  searchDescription: string;
};

/** Default metadata texts; admin-written SEO title and description take precedence on category pages. */
export const CATALOG_SEO_TEXT: Record<Locale, CatalogSeoText> = {
  uk: {
    categoryTitle: (name) => `${name} — купити оптом і в роздріб`,
    categoryDescription: (name, count, minPrice) =>
      `${name}: ${count}${minPrice ? ` від ${minPrice} грн` : ''}. Опт і роздріб, склад у Харкові, доставка по Україні.`,
    pageSuffix: (page) => ` — сторінка ${page}`,
    products: { one: 'товар', few: 'товари', many: 'товарів' },
    hubTitle: 'Каталог дверної фурнітури',
    hubDescription:
      'Завіси, замки, ручки, циліндри та міжкімнатні механізми оптом і в роздріб. Склад у Харкові, доставка по Україні.',
    searchTitle: (term) => `Пошук: ${term}`,
    searchEmptyTitle: 'Пошук товарів',
    searchDescription: 'Пошук дверної фурнітури за назвою або артикулом.',
  },
  ru: {
    categoryTitle: (name) => `${name} — купить оптом и в розницу`,
    categoryDescription: (name, count, minPrice) =>
      `${name}: ${count}${minPrice ? ` от ${minPrice} грн` : ''}. Опт и розница, склад в Харькове, доставка по Украине.`,
    pageSuffix: (page) => ` — страница ${page}`,
    products: { one: 'товар', few: 'товара', many: 'товаров' },
    hubTitle: 'Каталог дверной фурнитуры',
    hubDescription:
      'Петли, замки, ручки, цилиндры и межкомнатные механизмы оптом и в розницу. Склад в Харькове, доставка по Украине.',
    searchTitle: (term) => `Поиск: ${term}`,
    searchEmptyTitle: 'Поиск товаров',
    searchDescription: 'Поиск дверной фурнитуры по названию или артикулу.',
  },
};
