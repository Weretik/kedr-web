import { folderPath, formatDimensions, formatFileSize } from '@admin/media/model';
import { DetailField, DetailFieldList } from '@admin/shared/ui';

import type { MediaFile, MediaFolder } from '@admin/media/model';

const dateTime = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

interface MediaFileFactsProps {
  file: MediaFile;
  folders: readonly MediaFolder[];
}

/** Read-only facts of a file: where it is, type, size, resolution, and dates. */
export function MediaFileFacts({ file, folders }: MediaFileFactsProps) {
  return (
    <DetailFieldList>
      <DetailField
        label="Розташування"
        value={['Медіа', ...folderPath(folders, file.folderId)].join(' / ')}
      />
      <DetailField label="Тип" value={file.contentType} />
      <DetailField label="Розмір" value={formatFileSize(file.sizeBytes)} />
      <DetailField
        label="Роздільність"
        value={formatDimensions(file.width, file.height) ?? 'невідома'}
      />
      <DetailField label="Додано" value={dateTime.format(new Date(file.createdAt))} />
      <DetailField label="Змінено" value={dateTime.format(new Date(file.updatedAt))} />
    </DetailFieldList>
  );
}
