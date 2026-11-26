import { useGetUnresolvedCodesQuery } from '@admin/catalog-attributes/data-access';

/** How many 1C codes wait to be decoded: the count on «Перевірка → Коди з 1С»; unknown while loading. */
export function useUnresolvedCodesCount(): number | undefined {
  return useGetUnresolvedCodesQuery().data?.length;
}
