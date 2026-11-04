import { useGetMediaFoldersQuery, useUploadMediaFileMutation } from '@admin/media/data-access';
import { uploadIssue } from '@admin/media/model';
import { useGetProductMediaQuery, useSetProductMediaMutation } from '@admin/products/data-access';
import {
  addPhotos,
  movePhoto,
  removePhoto,
  setScheme,
  toProductMediaChange,
} from '@admin/products/model';
import { useState } from 'react';

import { productMediaErrorMessage } from '../model/product-media-errors';

import type { MediaFolder } from '@admin/media/model';
import type { ProductMediaChange } from '@admin/products/model';

/** Uploads from the product page go to the same top folders as the CDN files: «Товари» and «Схеми». */
const photoFolderName = 'Товари';
const schemeFolderName = 'Схеми';

const topFolderId = (folders: readonly MediaFolder[] | undefined, name: string) =>
  folders?.find((folder) => folder.parentId === null && folder.name === name)?.id ?? null;

/** Loads the product's photos and scheme; every change saves the whole set at once. */
export function useProductMediaEditor(productId: number) {
  const media = useGetProductMediaQuery(productId);
  const folders = useGetMediaFoldersQuery();
  const [save, saveState] = useSetProductMediaMutation();
  const [upload, uploadState] = useUploadMediaFileMutation();
  const [error, setError] = useState<string | null>(null);
  const current = media.data ? toProductMediaChange(media.data) : null;

  const apply = async (change: (value: ProductMediaChange) => ProductMediaChange) => {
    if (!current) return;
    setError(null);
    try {
      await save({ productId, change: change(current) }).unwrap();
    } catch (reason) {
      setError(productMediaErrorMessage(reason, 'save'));
    }
  };

  const uploadAll = async (files: readonly File[], folderName: string) => {
    const issue = files.map(uploadIssue).find(Boolean);
    if (issue) {
      setError(issue);
      return [];
    }
    setError(null);
    const folderId = topFolderId(folders.data?.folders, folderName);
    const ids: number[] = [];
    try {
      for (const file of files) ids.push((await upload({ file, folderId }).unwrap()).id);
    } catch (reason) {
      setError(productMediaErrorMessage(reason, 'upload'));
    }
    return ids;
  };

  return {
    media: media.data,
    loading: media.isLoading,
    loadError: media.isError,
    retry: () => void media.refetch(),
    busy: saveState.isLoading || uploadState.isLoading,
    error,
    movePhoto: (index: number, offset: -1 | 1) => apply((value) => movePhoto(value, index, offset)),
    removePhoto: (fileId: number) => apply((value) => removePhoto(value, fileId)),
    addPhotos: (fileIds: readonly number[]) => apply((value) => addPhotos(value, fileIds)),
    setScheme: (fileId: number | null) => apply((value) => setScheme(value, fileId)),
    uploadPhotos: async (files: readonly File[]) => {
      const ids = await uploadAll(files, photoFolderName);
      if (ids.length > 0) await apply((value) => addPhotos(value, ids));
    },
    uploadScheme: async (file: File) => {
      const [id] = await uploadAll([file], schemeFolderName);
      if (id) await apply((value) => setScheme(value, id));
    },
  };
}
