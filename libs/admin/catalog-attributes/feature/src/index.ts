import { lazy } from 'react';

/** Loaded with the first dictionary tab of «Вітрина сайту». */
export const CatalogDictionaryTab = lazy(() => import('./components/tabs/catalog-dictionary-tab'));
export type { CatalogDictionaryTabProps } from './components/tabs/catalog-dictionary-tab';
