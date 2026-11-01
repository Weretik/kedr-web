import { getCatalogNavigation } from '@site/catalog/feature';
import { LOCALES, LOCALE_LANGUAGE_TAGS, isLocale } from '@site/core/i18n';
import { JsonLd, buildOrganizationJsonLd, buildRootMetadata } from '@site/core/seo';
import { SiteShell, ThemeProvider } from '@site/core/shell';
import { notFound } from 'next/navigation';

import '../global.css';
import { jetBrainsMono, onest } from '../fonts';

import type { Metadata, Viewport } from 'next';

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
  const catalogNavigation = await getCatalogNavigation(locale);

  return (
    <html
      lang={LOCALE_LANGUAGE_TAGS[locale]}
      className={`${onest.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      {/* Browser extensions (Grammarly and similar) add attributes to <body> before React hydrates. */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <SiteShell locale={locale} catalogNavigation={catalogNavigation}>
            {children}
          </SiteShell>
        </ThemeProvider>
        <JsonLd data={buildOrganizationJsonLd(locale)} />
      </body>
    </html>
  );
}
