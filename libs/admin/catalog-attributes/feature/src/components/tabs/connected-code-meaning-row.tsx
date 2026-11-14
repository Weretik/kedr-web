import {
  useCreateAttributeValueMutation,
  useGetCatalogAttributeQuery,
  useGetCatalogAttributesQuery,
} from '@admin/catalog-attributes/data-access';
import { CodeMeaningRow } from '@admin/catalog-attributes/ui';
import { skipToken } from '@reduxjs/toolkit/query';

import type { MeaningRowSlotProps } from '@admin/catalog-attributes/ui';

/**
 * A meaning row of a code (spec catalog/009) with the attributes that have values, the values of the chosen
 * attribute, and «+ Нове значення» that adds one to it.
 */
export function ConnectedCodeMeaningRow(props: MeaningRowSlotProps) {
  const attributes = useGetCatalogAttributesQuery();
  const details = useGetCatalogAttributeQuery(props.row.attributeId ?? skipToken);
  const [create, createState] = useCreateAttributeValueMutation();
  const attributeId = props.row.attributeId;

  const createValue = async (nameUk: string) => {
    if (attributeId === null) return undefined;
    try {
      const result = await create({
        attributeId,
        change: { nameUk, nameRu: null, sortOrder: 0, swatchHex: null, swatchMediaFileId: null },
      }).unwrap();
      const created = result.values
        .filter((value) => value.nameUk === nameUk)
        .sort((first, second) => second.id - first.id)[0];
      return created?.id;
    } catch {
      return undefined;
    }
  };

  return (
    <CodeMeaningRow
      {...props}
      attributes={(attributes.data ?? []).filter((attribute) => attribute.kind !== 'number')}
      creating={createState.isLoading}
      onCreateValue={createValue}
      values={attributeId === null ? [] : (details.data?.values ?? [])}
      valuesLoading={details.isFetching}
    />
  );
}
