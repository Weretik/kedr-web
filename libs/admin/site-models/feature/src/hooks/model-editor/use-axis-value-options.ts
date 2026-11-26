import { useGetAttributeValueOptionsQuery } from '@admin/site-models/data-access';
import { skipToken } from '@reduxjs/toolkit/query';

import type { AttributeValueOption, SiteModelAxis } from '@admin/site-models/model';

/** The list values of each axis (at most six), for the product cell pickers of the model card. */
export function useAxisValueOptions(axes: readonly SiteModelAxis[]) {
  const ids = axes.map((axis) => axis.attributeId);
  const queries = [
    useGetAttributeValueOptionsQuery(ids[0] ?? skipToken),
    useGetAttributeValueOptionsQuery(ids[1] ?? skipToken),
    useGetAttributeValueOptionsQuery(ids[2] ?? skipToken),
    useGetAttributeValueOptionsQuery(ids[3] ?? skipToken),
    useGetAttributeValueOptionsQuery(ids[4] ?? skipToken),
    useGetAttributeValueOptionsQuery(ids[5] ?? skipToken),
  ];
  const options: Record<number, readonly AttributeValueOption[]> = {};
  ids.forEach((id, index) => {
    const data = queries[index]?.data;
    if (data) options[id] = data;
  });
  return options;
}
