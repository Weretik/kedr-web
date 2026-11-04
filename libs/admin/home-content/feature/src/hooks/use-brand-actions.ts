import {
  useCreateHomeBrandMutation,
  useDeleteHomeBrandMutation,
  useReorderHomeBrandsMutation,
  useUpdateHomeBrandMutation,
} from '@admin/home-content/data-access';

import { useHomeActionRunner } from './home-action-runner';

import type { HomeBrand, HomeBrandDraft, HomeBrandLogo } from '@admin/home-content/model';

/** Add, edit, remove, and reorder the home page brands. */
export function useBrandActions(onNotice: (message: string) => void) {
  const [create, creating] = useCreateHomeBrandMutation();
  const [update, updating] = useUpdateHomeBrandMutation();
  const [remove, removing] = useDeleteHomeBrandMutation();
  const [reorder, reordering] = useReorderHomeBrandsMutation();
  const runner = useHomeActionRunner(onNotice);

  return {
    saving: creating.isLoading || updating.isLoading,
    removing: removing.isLoading,
    reordering: reordering.isLoading,
    orderError: runner.orderError,
    clearOrderError: runner.clearOrderError,
    save: (id: number | null, draft: HomeBrandDraft & { logo: HomeBrandLogo }) =>
      id === null
        ? runner.run('saveBrand', () => create(draft), 'Бренд додано в кінець ряду.')
        : runner.run('saveBrand', () => update({ id, draft }), 'Збережено.'),
    remove: (brand: HomeBrand) =>
      runner.run('remove', () => remove(brand.id), 'Бренд прибрано з головної.'),
    move: (brands: readonly HomeBrand[], brand: HomeBrand, to: number) =>
      runner.move(
        brands.map((candidate) => candidate.id),
        brand.id,
        to,
        reorder,
      ),
  };
}
