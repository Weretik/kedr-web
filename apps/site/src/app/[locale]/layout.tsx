import { LOCALES, LOCALE_LANGUAGE_TAGS, isLocale } from '@site/core/i18n';
import { JsonLd, buildOrganizationJsonLd, buildRootMetadata } from '@site/core/seo';
import { SiteShell, ThemeProvider } from '@site/core/shell';
import { notFound } from 'next/navigation';

import '../global.css';
import { jetBrainsMono, onest } from '../fonts';

import type { Metadata, Viewport } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildRootMetadata(locale) : {};
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0d0c' },
  ],
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={LOCALE_LANGUAGE_TAGS[locale]}
      className={`${onest.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <SiteShell locale={locale}>{children}</SiteShell>
        </ThemeProvider>
        <JsonLd data={buildOrganizationJsonLd(locale)} />
      </body>
    </html>
  );
}
