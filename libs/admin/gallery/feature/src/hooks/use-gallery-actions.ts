import {
  useAddGalleryPhotosMutation,
  useAddGalleryVideoMutation,
  useDeleteGalleryItemMutation,
  useReorderGalleryMutation,
  useUpdateGalleryItemMutation,
} from '@admin/gallery/data-access';
import { moveGalleryItem } from '@admin/gallery/model';
import { useState } from 'react';

import { galleryErrorMessage } from '../errors/gallery-error-message';

import type { GalleryItem, GalleryTexts } from '@admin/gallery/model';

/** Every gallery change with its pending flag; a failed change returns its message instead of throwing. */
export function useGalleryActions(onNotice: (message: string) => void) {
  const [addPhotos, photos] = useAddGalleryPhotosMutation();
  const [addVideo, video] = useAddGalleryVideoMutation();
  const [update, updating] = useUpdateGalleryItemMutation();
  const [remove, removing] = useDeleteGalleryItemMutation();
  const [reorder, reordering] = useReorderGalleryMutation();
  const [orderError, setOrderError] = useState<string | null>(null);

  const run = async (
    action: Parameters<typeof galleryErrorMessage>[1],
    request: () => Promise<unknown>,
  ) => {
    try {
      await request();
      return undefined;
    } catch (error) {
      return galleryErrorMessage(error, action);
    }
  };

  return {
    adding: photos.isLoading || video.isLoading,
    saving: updating.isLoading,
    removing: removing.isLoading,
    reordering: reordering.isLoading,
    orderError,
    clearOrderError: () => setOrderError(null),
    addPhotos: async (ids: readonly number[], before: number) => {
      let added = 0;
      const error = await run('addPhotos', async () => {
        added = (await addPhotos(ids).unwrap()).length - before;
      });
      if (!error) onNotice(added > 0 ? `Додано фото: ${added}.` : 'Ці фото вже є в галереї.');
      return error;
    },
    addVideo: async (url: string, texts: GalleryTexts) => {
      const error = await run('addVideo', () => addVideo({ url, texts }).unwrap());
      if (!error) onNotice('Відео додано в кінець галереї.');
      return error;
    },
    save: async (item: GalleryItem, texts: GalleryTexts) => {
      const error = await run('save', () => update({ id: item.id, texts }).unwrap());
      if (!error) onNotice('Збережено.');
      return error;
    },
    remove: async (item: GalleryItem) => {
      const error = await run('remove', () => remove(item.id).unwrap());
      if (!error) onNotice('Прибрано з галереї.');
      return error;
    },
    move: async (items: readonly GalleryItem[], item: GalleryItem, to: number) => {
      const ids = moveGalleryItem(
        items.map((candidate) => candidate.id),
        item.id,
        to,
      );
      setOrderError(null);
      const error = await run('reorder', () => reorder(ids).unwrap());
      if (error) setOrderError(error);
    },
  };
}
