import { FALLBACK_COMPANY_CONTACTS } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { DoorClosedIcon, PhoneIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';

import type { Locale } from '@site/core/i18n';

const TEXT: Record<
  Locale,
  {
    heading: string;
    body: string;
    home: string;
    catalog: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchSubmit: string;
    phoneHint: string;
  }
> = {
  uk: {
    heading: 'Цих дверей тут немає',
    body: 'Сторінку видалили, перенесли або адреса введена з помилкою. Скористайтесь пошуком чи перейдіть до каталогу.',
    home: 'На головну',
    catalog: 'До каталогу',
    searchLabel: 'Пошук товарів',
    searchPlaceholder: 'Код або назва товару',
    searchSubmit: 'Знайти',
    phoneHint: 'Не знайшли потрібне? Зателефонуйте нам:',
  },
  ru: {
    heading: 'Этих дверей здесь нет',
    body: 'Страницу удалили, перенесли или адрес введен с ошибкой. Воспользуйтесь поиском или перейдите в каталог.',
    home: 'На главную',
    catalog: 'В каталог',
    searchLabel: 'Поиск товаров',
    searchPlaceholder: 'Код или название товара',
    searchSubmit: 'Найти',
    phoneHint: 'Не нашли нужное? Позвоните нам:',
  },
};

/**
 * Not-found page in one language with the way back: home, catalog, product search, and the phone.
 * Used by both app 404 files; the search is a plain GET form, so it works without client code.
 */
export function NotFoundView({ locale }: { locale: Locale }) {
  const text = TEXT[locale];
  const { phone } = FALLBACK_COMPANY_CONTACTS;

  return (
    <section
      className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24"
      lang={locale === 'uk' ? 'uk-UA' : 'ru-UA'}
    >
      <DoorClosedIcon aria-hidden className="size-14 text-brand-text" strokeWidth={1.25} />
      <p className="mt-4 font-mono text-7xl font-semibold tracking-tight text-brand-text sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{text.heading}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{text.body}</p>

      <form
        action={localizedPath(locale, '/search')}
        method="get"
        role="search"
        className="mt-8 flex w-full max-w-md gap-2"
      >
        <label htmlFor="not-found-search" className="sr-only">
          {text.searchLabel}
        </label>
        <input
          id="not-found-search"
          name="q"
          type="search"
          placeholder={text.searchPlaceholder}
          className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
        <Button type="submit" className="min-h-11">
          <SearchIcon aria-hidden className="size-4" />
          {text.searchSubmit}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="min-h-11">
          <Link href={localizedPath(locale)}>{text.home}</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={localizedPath(locale, '/catalog')}>{text.catalog}</Link>
        </Button>
      </div>

      <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 text-sm text-muted-foreground">
        {text.phoneHint}
        <a
          href={`tel:${phone.e164}`}
          className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:underline"
        >
          <PhoneIcon aria-hidden className="size-4" strokeWidth={1.75} />
          {phone.display}
        </a>
      </p>
    </section>
  );
}
