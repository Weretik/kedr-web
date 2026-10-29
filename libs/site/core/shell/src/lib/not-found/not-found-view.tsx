import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import Link from 'next/link';

import type { Locale } from '@site/core/i18n';

const TEXT: Record<Locale, { heading: string; body: string; home: string }> = {
  uk: {
    heading: 'Сторінку не знайдено',
    body: 'Можливо, її видалили або адреса введена з помилкою.',
    home: 'На головну',
  },
  ru: {
    heading: 'Страница не найдена',
    body: 'Возможно, ее удалили или адрес введен с ошибкой.',
    home: 'На главную',
  },
};

/** Not-found message with a link to the home page of the given language; used by both app 404 files. */
export function NotFoundView({
  locale,
  headingLevel = 'h1',
}: {
  locale: Locale;
  headingLevel?: 'h1' | 'h2';
}) {
  const text = TEXT[locale];
  const Heading = headingLevel;

  return (
    <section className="py-12" lang={locale === 'uk' ? 'uk-UA' : 'ru-UA'}>
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <Heading className="mt-2 text-3xl font-semibold tracking-tight">{text.heading}</Heading>
      <p className="mt-3 text-muted-foreground">{text.body}</p>
      <Button asChild className="mt-6">
        <Link href={localizedPath(locale)}>{text.home}</Link>
      </Button>
    </section>
  );
}
