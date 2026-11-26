import { lazy } from 'react';

/** Loaded with the first dictionary tab of «Перевірка» or «Ознаки та фільтри». */
export const CatalogDictionaryTab = lazy(() => import('./components/tabs/catalog-dictionary-tab'));
export type { CatalogDictionaryTabProps } from './components/tabs/catalog-dictionary-tab';
export { useUnresolvedCodesCount } from './hooks/use-unresolved-codes-count';
