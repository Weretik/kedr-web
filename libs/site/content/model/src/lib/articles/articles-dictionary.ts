import { pluralize } from '@site/core/i18n';

import type { Locale } from '@site/core/i18n';

export type ArticlesDictionary = {
  title: string;
  intro: string;
  home: string;
  breadcrumbs: string;
  searchRegion: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmit: string;
  clearSearch: string;
  pageSizeLabel: string;
  pageSizeCaption: string;
  applyPageSize: string;
  pagination: string;
  previous: string;
  next: string;
  readArticle: string;
  missingCover: string;
  emptyTitle: string;
  emptyText: string;
  noResultsTitle: string;
  noResultsText: string;
  loading: string;
  updating: string;
  backToList: string;
  /** The block after an article: from reading to choosing hardware. */
  nextStep: { title: string; text: string; catalog: string; wholesale: string };
  published: string;
  found: (total: number) => string;
  range: (start: number, end: number, total: number) => string;
  page: (page: number) => string;
  pagePosition: (page: number, count: number) => string;
};

const dictionaries: Record<Locale, ArticlesDictionary> = {
  uk: {
    title: 'Статті',
    intro: 'Про вибір дверної фурнітури, матеріали та практичні рішення.',
    home: 'Головна',
    breadcrumbs: 'Ви тут',
    searchRegion: 'Пошук матеріалів',
    searchLabel: 'Пошук у статтях',
    searchPlaceholder: 'Назва або текст статті',
    searchSubmit: 'Знайти статтю',
    clearSearch: 'Очистити пошук',
    pageSizeLabel: 'Статей на сторінці',
    pageSizeCaption: 'На сторінці',
    applyPageSize: 'Застосувати',
    pagination: 'Сторінки статей',
    previous: 'Попередня',
    next: 'Наступна',
    readArticle: 'Читати статтю',
    missingCover: 'Обкладинка відсутня',
    emptyTitle: 'Статті незабаром з’являться',
    emptyText: 'Зараз у цьому розділі ще немає матеріалів.',
    noResultsTitle: 'За вашим запитом статей не знайдено',
    noResultsText: 'Спробуйте іншу назву чи слово з тексту або очистіть пошук.',
    loading: 'Завантажуємо статті…',
    updating: 'Оновлюємо список…',
    backToList: 'До всіх статей',
    nextStep: {
      title: 'Підберіть фурнітуру для своїх дверей',
      text: 'Перегляньте розділи каталогу або запитайте оптові умови в менеджера.',
      catalog: 'Перейти до каталогу',
      wholesale: 'Оптові умови',
    },
    published: 'Опубліковано',
    found: (total) =>
      `Знайдено ${pluralize('uk', total, { one: 'статтю', few: 'статті', many: 'статей' })}`,
    range: (start, end, total) => `Показано ${start}–${end} із ${total}`,
    page: (page) => `Сторінка ${page}`,
    pagePosition: (page, count) => `${page} / ${count}`,
  },
  ru: {
    title: 'Статьи',
    intro: 'О выборе дверной фурнитуры, материалах и практических решениях.',
    home: 'Главная',
    breadcrumbs: 'Вы здесь',
    searchRegion: 'Поиск материалов',
    searchLabel: 'Поиск в статьях',
    searchPlaceholder: 'Название или текст статьи',
    searchSubmit: 'Найти статью',
    clearSearch: 'Очистить поиск',
    pageSizeLabel: 'Статей на странице',
    pageSizeCaption: 'На странице',
    applyPageSize: 'Применить',
    pagination: 'Страницы статей',
    previous: 'Предыдущая',
    next: 'Следующая',
    readArticle: 'Читать статью',
    missingCover: 'Обложка отсутствует',
    emptyTitle: 'Статьи скоро появятся',
    emptyText: 'Сейчас в этом разделе ещё нет материалов.',
    noResultsTitle: 'По вашему запросу статьи не найдены',
    noResultsText: 'Попробуйте другое название или слово из текста либо очистите поиск.',
    loading: 'Загружаем статьи…',
    updating: 'Обновляем список…',
    backToList: 'Ко всем статьям',
    nextStep: {
      title: 'Подберите фурнитуру для своих дверей',
      text: 'Посмотрите разделы каталога или узнайте оптовые условия у менеджера.',
      catalog: 'Перейти в каталог',
      wholesale: 'Оптовые условия',
    },
    published: 'Опубликовано',
    found: (total) =>
      `Найдено ${pluralize('ru', total, { one: 'статья', few: 'статьи', many: 'статей' })}`,
    range: (start, end, total) => `Показано ${start}–${end} из ${total}`,
    page: (page) => `Страница ${page}`,
    pagePosition: (page, count) => `${page} / ${count}`,
  },
};

export function getArticlesDictionary(locale: Locale): ArticlesDictionary {
  return dictionaries[locale];
}
