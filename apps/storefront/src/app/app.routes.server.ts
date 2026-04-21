import { RenderMode, ServerRoute } from '@angular/ssr';

import { ARTICLE_IDS } from './route-params/article-ids';
import { CATALOG_CATEGORY_SLUGS } from './route-params/catalog-category-slugs';
import { REGION_CITY_SLUGS } from './route-params/region-city-slugs';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'uk',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'ru',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'uk/region/:city',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return REGION_CITY_SLUGS.map((city) => ({ city }));
    },
  },
  {
    path: 'ru/region/:city',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return REGION_CITY_SLUGS.map((city) => ({ city }));
    },
  },
  {
    path: 'uk/articles/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ARTICLE_IDS.map((id) => ({ id }));
    },
  },
  {
    path: 'ru/articles/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ARTICLE_IDS.map((id) => ({ id }));
    },
  },
  {
    path: 'uk/catalog/:categorySlug/products',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return CATALOG_CATEGORY_SLUGS.map((categorySlug) => ({ categorySlug }));
    },
  },
  {
    path: 'ru/catalog/:categorySlug/products',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return CATALOG_CATEGORY_SLUGS.map((categorySlug) => ({ categorySlug }));
    },
  },
  {
    path: 'uk/catalog/product/:productSlug',
    renderMode: RenderMode.Client,
  },
  {
    path: 'ru/catalog/product/:productSlug',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
