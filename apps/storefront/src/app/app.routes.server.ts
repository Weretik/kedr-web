import { RenderMode, ServerRoute } from '@angular/ssr';

import { ARTICLE_IDS } from './route-params/article-ids';
import { REGION_CITY_SLUGS } from './route-params/region-city-slugs';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'region/:city',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return REGION_CITY_SLUGS.map((city) => ({ city }));
    },
  },
  {
    path: 'articles/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ARTICLE_IDS.map((id) => ({ id }));
    },
  },
  {
    path: 'catalog/:categorySlug/products',
    renderMode: RenderMode.Client,
  },
  {
    path: 'catalog/product/:productSlug',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
