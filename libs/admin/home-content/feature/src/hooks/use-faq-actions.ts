import {
  useCreateHomeFaqItemMutation,
  useDeleteHomeFaqItemMutation,
  useReorderHomeFaqMutation,
  useUpdateHomeFaqItemMutation,
} from '@admin/home-content/data-access';

import { useHomeActionRunner } from './home-action-runner';

import type { HomeFaqItem, HomeFaqTexts } from '@admin/home-content/model';

/** Add, edit, delete, and reorder the home page questions. */
export function useFaqActions(onNotice: (message: string) => void) {
  const [create, creating] = useCreateHomeFaqItemMutation();
  const [update, updating] = useUpdateHomeFaqItemMutation();
  const [remove, removing] = useDeleteHomeFaqItemMutation();
  const [reorder, reordering] = useReorderHomeFaqMutation();
  const runner = useHomeActionRunner(onNotice);

  return {
    saving: creating.isLoading || updating.isLoading,
    removing: removing.isLoading,
    reordering: reordering.isLoading,
    orderError: runner.orderError,
    clearOrderError: runner.clearOrderError,
    save: (id: number | null, texts: HomeFaqTexts) =>
      id === null
        ? runner.run('saveFaq', () => create(texts), 'Питання додано в кінець списку.')
        : runner.run('saveFaq', () => update({ id, texts }), 'Збережено.'),
    remove: (item: HomeFaqItem) => runner.run('remove', () => remove(item.id), 'Питання видалено.'),
    move: (items: readonly HomeFaqItem[], item: HomeFaqItem, to: number) =>
      runner.move(
        items.map((candidate) => candidate.id),
        item.id,
        to,
        reorder,
      ),
  };
}
