import {
  mediaAcceptedTypes,
  mediaFileNameMaxLength,
  mediaUploadMaxBytes,
} from '../entities/media-file';
import { mediaFolderNameMaxLength } from '../entities/media-folder';

/** A Ukrainian sentence for a file the backend would reject, or `null` when it may be uploaded. */
export function uploadIssue(file: { name: string; size: number; type: string }): string | null {
  if (!(mediaAcceptedTypes as readonly string[]).includes(file.type))
    return `«${file.name}» не є фото JPEG, PNG або WebP.`;
  if (file.size === 0) return `«${file.name}» порожній.`;
  if (file.size > mediaUploadMaxBytes) return `«${file.name}» більший за 15 МБ.`;
  return null;
}

export function folderNameIssue(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Вкажіть назву папки.';
  if (trimmed.length > mediaFolderNameMaxLength)
    return `Назва папки — до ${mediaFolderNameMaxLength} символів.`;
  return null;
}

export function fileNameIssue(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Вкажіть назву файлу.';
  if (trimmed.length > mediaFileNameMaxLength)
    return `Назва файлу — до ${mediaFileNameMaxLength} символів.`;
  return null;
}
