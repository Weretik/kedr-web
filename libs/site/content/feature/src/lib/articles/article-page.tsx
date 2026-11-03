import { getArticle, getArticles } from '@site/content/data-access';
import { buildArticleJsonLd, buildArticleMetadata } from '@site/content/seo';
import { ArticleContent } from '@site/content/ui';
import { LOCALES } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { notFound } from 'next/navigation';

import type { Locale } from '@site/core/i18n';

type ArticlePageProps = { locale: Locale; slug: string };

export function ArticlePage({ locale, slug }: ArticlePageProps) {
  const article = getArticle(locale, slug);
  if (!article) notFound();
  return (
    <>
      <ArticleContent locale={locale} article={article} />
      <JsonLd data={buildArticleJsonLd(locale, article)} />
    </>
  );
}

export function generateArticleMetadata(locale: Locale, slug: string) {
  const article = getArticle(locale, slug);
  if (!article) notFound();
  return buildArticleMetadata(locale, article);
}

export function getArticleStaticParams(locale?: Locale) {
  return (locale ? [locale] : LOCALES).flatMap((currentLocale) =>
    getArticles(currentLocale).map(({ slug }) => ({ locale: currentLocale, slug })),
  );
}
