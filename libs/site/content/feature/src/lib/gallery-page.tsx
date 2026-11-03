import { getGalleryMedia } from '@site/content/data-access';
import { INITIAL_GALLERY_COUNT, getGalleryDictionary } from '@site/content/model';
import { buildGalleryBreadcrumbJsonLd } from '@site/content/seo';
import { GalleryBrowser, GalleryHeader } from '@site/content/ui';
import { JsonLd } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';

/** Static server content; only the collection's viewing controls hydrate in the browser. */
export function GalleryPage({ locale }: { locale: Locale }) {
  const dictionary = getGalleryDictionary(locale);
  const items = getGalleryMedia(locale);
  const remaining = items.slice(INITIAL_GALLERY_COUNT);

  return (
    <>
      <div className="py-5 sm:py-8 lg:py-10">
        <GalleryHeader locale={locale} />
        <GalleryBrowser items={items} dictionary={dictionary} />
        {remaining.length > 0 && (
          <noscript>
            <section aria-labelledby="gallery-noscript-title" className="mt-8">
              <h2 id="gallery-noscript-title" className="text-xl font-semibold">
                {dictionary.noScriptText}
              </h2>
              <ul className="mt-4 space-y-3">
                {remaining.map((item) => (
                  <li key={item.id}>
                    <a
                      href={
                        item.kind === 'photo'
                          ? item.image.src
                          : 'https://www.youtube.com/watch?v=' + encodeURIComponent(item.youtubeId)
                      }
                      className="underline underline-offset-4"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </noscript>
        )}
      </div>
      <JsonLd data={buildGalleryBreadcrumbJsonLd(locale)} />
    </>
  );
}
