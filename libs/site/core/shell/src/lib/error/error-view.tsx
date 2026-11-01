'use client';

import { DEFAULT_LOCALE, isLocale } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { useParams } from 'next/navigation';

import type { Locale } from '@site/core/i18n';

const TEXT: Record<Locale, { heading: string; body: string; retry: string }> = {
  uk: {
    heading: 'Сторінка тимчасово недоступна',
    body: 'Не вдалося завантажити дані. Спробуйте ще раз за хвилину.',
    retry: 'Спробувати ще раз',
  },
  ru: {
    heading: 'Страница временно недоступна',
    body: 'Не удалось загрузить данные. Попробуйте еще раз через минуту.',
    retry: 'Попробовать еще раз',
  },
};

/**
 * Error inside the site frame for pages whose data failed to load (for example the catalog API is down).
 * The response status is 500, so search engines retry later instead of indexing the message.
 */
export function ErrorView({ retry }: { retry: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale && isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const text = TEXT[locale];

  return (
    <section role="alert" className="py-12">
      <p className="font-mono text-sm text-muted-foreground">500</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{text.heading}</h1>
      <p className="mt-3 text-muted-foreground">{text.body}</p>
      <Button type="button" className="mt-6" onClick={retry}>
        {text.retry}
      </Button>
    </section>
  );
}
