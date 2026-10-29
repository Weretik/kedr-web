import { useState } from 'react';

import { checkAvatarFile } from './check-avatar-file';

import type { ChangeRequest } from '../hooks/use-confirmed-change';

interface AvatarChangeOptions {
  /** Who the photo is for, as the confirmation names them. */
  subject: string;
  upload: (file: File) => Promise<unknown>;
  request: (change: ChangeRequest) => void;
}

/** Checks a chosen photo and, when it fits the limits, asks to confirm it with a preview. */
export function useAvatarChange() {
  const [fileError, setFileError] = useState<string | null>(null);

  const choose = async (file: File, { request, subject, upload }: AvatarChangeOptions) => {
    const error = await checkAvatarFile(file);
    setFileError(error ?? null);
    if (error) return;

    request({
      title: 'Змінити фото?',
      description: `Нове фото для ${subject}. Воно обріжеться до квадрата по центру.`,
      confirmLabel: 'Зберегти фото',
      previewUrl: URL.createObjectURL(file),
      successMessage: 'Фото оновлено.',
      run: () => upload(file),
    });
  };

  return { choose, clearFileError: () => setFileError(null), fileError };
}
