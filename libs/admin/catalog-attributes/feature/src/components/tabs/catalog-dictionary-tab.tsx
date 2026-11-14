import { AttributesTab } from './attributes-tab';
import { CategoryFiltersTab } from './category-filters-tab';
import { UnresolvedCodesTab } from './unresolved-codes-tab';

export interface CatalogDictionaryTabProps {
  tab: 'attributes' | 'codes' | 'filters';
  /** Admins change the dictionary; Managers see it. */
  canEdit: boolean;
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (text: string) => void;
}

/**
 * The «Ознаки», «Не розшифровані коди», and «Фільтри категорій» tabs of «Вітрина сайту» (spec catalog/006 phase 3,
 * catalog/007 stage 4c).
 */
export function CatalogDictionaryTab(props: CatalogDictionaryTabProps) {
  switch (props.tab) {
    case 'attributes':
      return (
        <AttributesTab
          canEdit={props.canEdit}
          creating={props.creating}
          onCreatingChange={props.onCreatingChange}
          onNotice={props.onNotice}
        />
      );
    case 'codes':
      return <UnresolvedCodesTab canEdit={props.canEdit} onNotice={props.onNotice} />;
    case 'filters':
      return <CategoryFiltersTab canEdit={props.canEdit} onNotice={props.onNotice} />;
  }
}

export default CatalogDictionaryTab;
