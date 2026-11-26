import { pageTitle, withoutBrand } from '@site/core/config';

import type { PageSeoText } from './page-seo-types';
import type { Metadata } from 'next';

/**
 * Page metadata with the editor's title and description in place of the code ones, also in the link preview.
 * A title keeps the form it had: an absolute title stays absolute, a plain one gets the site template once
 * (a brand the editor wrote is removed, and a title too long for it goes without).
 */
export function applyPageSeo(metadata: Metadata, seo: PageSeoText | undefined): Metadata {
  if (!seo || (!seo.title && !seo.description)) return metadata;

  const title = seo.title
    ? isAbsoluteTitle(metadata.title)
      ? { absolute: seo.title }
      : pageTitle(seo.title)
    : metadata.title;
  const description = seo.description ?? metadata.description;

  return {
    ...metadata,
    title,
    description,
    ...(metadata.openGraph
      ? {
          openGraph: {
            ...metadata.openGraph,
            ...(seo.title ? { title: withoutBrand(seo.title) } : {}),
            ...(seo.description ? { description: seo.description } : {}),
          },
        }
      : {}),
  };
}

const isAbsoluteTitle = (title: Metadata['title']) =>
  typeof title === 'object' && title !== null && 'absolute' in title;
