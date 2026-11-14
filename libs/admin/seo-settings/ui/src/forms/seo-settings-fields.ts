import type { SeoCodeField } from '@admin/seo-settings/model';

/** Label and help of each code, shared by the page and the edit panel. */
export const seoCodeLabels: Record<SeoCodeField, { label: string; hint: string }> = {
  googleAnalyticsId: {
    label: 'Google Analytics 4',
    hint: 'Ідентифікатор потоку даних, наприклад G-AB12CD34EF. Порожньо: аналітика не підключена.',
  },
  googleTagManagerId: {
    label: 'Google Tag Manager',
    hint: 'Ідентифікатор контейнера, наприклад GTM-AB12CD3. Заповнюйте, лише якщо SEO-фахівець працює через Tag Manager.',
  },
  googleSiteVerification: {
    label: 'Підтвердження Google Search Console',
    hint: 'Значення content з мета-тегу google-site-verification. Можна вставити весь мета-тег.',
  },
  bingSiteVerification: {
    label: 'Підтвердження Bing Webmaster',
    hint: 'Значення content з мета-тегу msvalidate.01. Можна вставити весь мета-тег.',
  },
};
