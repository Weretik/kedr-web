import { lazy } from 'react';

/** Loaded with the first dictionary tab of «Вітрина сайту». */
export const CatalogDictionaryTab = lazy(() => import('./components/catalog-dictionary-tab'));
export type { CatalogDictionaryTabProps } from './components/catalog-dictionary-tab';
