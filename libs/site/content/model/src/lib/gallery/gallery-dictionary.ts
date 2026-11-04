import type { GalleryFilter } from './gallery-types';
import type { Locale } from '@site/core/i18n';

/** Plain serializable copy for the server header and the gallery's client island. */
export type GalleryDictionary = Readonly<{
  locale: Locale;
  title: string;
  intro: string;
  home: string;
  breadcrumbs: string;
  collectionLabel: string;
  filtersLabel: string;
  filters: Readonly<Record<GalleryFilter, string>>;
  photoLabel: string;
  videoLabel: string;
  showMore: string;
  showAll: string;
  emptyTitle: string;
  emptyText: string;
  emptyFilterTitle: string;
  emptyFilterText: string;
  openPhoto: string;
  openVideo: string;
  close: string;
  previous: string;
  next: string;
  position: string;
  itemsAdded: string;
  imageLoading: string;
  imageError: string;
  retryImage: string;
  retryVideo: string;
  videoHelp: string;
  watchOriginal: string;
  viewerLabel: string;
  noScriptText: string;
  /** Fallbacks for a card the admin left without a title. */
  untitledPhoto: string;
  untitledVideo: string;
  posterAlt: string;
}>;

const dictionaries: Readonly<Record<Locale, GalleryDictionary>> = {
  uk: {
    locale: 'uk',
    title: 'Галерея та відео',
    intro: 'Деталі, фактури та огляди дверної фурнітури.',
    home: 'Головна',
    breadcrumbs: 'Ви тут',
    collectionLabel: 'Матеріали галереї',
    filtersLabel: 'Формат матеріалів',
    filters: { all: 'Усі', photo: 'Фото', video: 'Відео' },
    photoLabel: 'Фото',
    videoLabel: 'Відео',
    showMore: 'Показати ще',
    showAll: 'Показати все',
    emptyTitle: 'Матеріалів поки немає',
    emptyText: 'У цьому розділі ще немає опублікованих фото чи відео.',
    emptyFilterTitle: 'У цьому форматі матеріалів поки немає',
    emptyFilterText: 'Оберіть інший формат або перегляньте всі матеріали.',
    openPhoto: 'Переглянути фото: {title}',
    openVideo: 'Переглянути відео: {title}',
    close: 'Закрити перегляд',
    previous: 'Попередній матеріал',
    next: 'Наступний матеріал',
    position: 'Матеріал {current} із {total}',
    itemsAdded: 'Додано матеріалів: {count}',
    imageLoading: 'Завантажуємо зображення…',
    imageError: 'Не вдалося завантажити зображення',
    retryImage: 'Завантажити зображення ще раз',
    retryVideo: 'Перезавантажити відео',
    videoHelp: 'Якщо відео не відтворюється, спробуйте ще раз або відкрийте оригінал.',
    watchOriginal: 'Відкрити на YouTube',
    viewerLabel: 'Перегляд матеріалу галереї',
    noScriptText: 'Решта матеріалів галереї',
    untitledPhoto: 'Фото з галереї',
    untitledVideo: 'Відео з галереї',
    posterAlt: 'Постер відео «{title}»',
  },
  ru: {
    locale: 'ru',
    title: 'Галерея и видео',
    intro: 'Детали, фактуры и обзоры дверной фурнитуры.',
    home: 'Главная',
    breadcrumbs: 'Вы здесь',
    collectionLabel: 'Материалы галереи',
    filtersLabel: 'Формат материалов',
    filters: { all: 'Все', photo: 'Фото', video: 'Видео' },
    photoLabel: 'Фото',
    videoLabel: 'Видео',
    showMore: 'Показать ещё',
    showAll: 'Показать всё',
    emptyTitle: 'Материалов пока нет',
    emptyText: 'В этом разделе ещё нет опубликованных фото или видео.',
    emptyFilterTitle: 'В этом формате материалов пока нет',
    emptyFilterText: 'Выберите другой формат или просмотрите все материалы.',
    openPhoto: 'Посмотреть фото: {title}',
    openVideo: 'Посмотреть видео: {title}',
    close: 'Закрыть просмотр',
    previous: 'Предыдущий материал',
    next: 'Следующий материал',
    position: 'Материал {current} из {total}',
    itemsAdded: 'Добавлено материалов: {count}',
    imageLoading: 'Загружаем изображение…',
    imageError: 'Не удалось загрузить изображение',
    retryImage: 'Загрузить изображение ещё раз',
    retryVideo: 'Перезагрузить видео',
    videoHelp: 'Если видео не воспроизводится, попробуйте ещё раз или откройте оригинал.',
    watchOriginal: 'Открыть на YouTube',
    viewerLabel: 'Просмотр материала галереи',
    noScriptText: 'Остальные материалы галереи',
    untitledPhoto: 'Фото из галереи',
    untitledVideo: 'Видео из галереи',
    posterAlt: 'Постер видео «{title}»',
  },
};

export function getGalleryDictionary(locale: Locale): GalleryDictionary {
  return dictionaries[locale];
}
