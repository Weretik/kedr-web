import { MediaDropZone, MediaFileGrid } from '@admin/media/ui';
import { Card, Pagination, Stack } from '@mui/material';

import { MediaFilesToolbar } from './media-files-toolbar';
import { MediaScopeBar } from './media-scope-bar';

import type { useMediaFileActions } from '../hooks/use-media-file-actions';
import type { useMediaFilesQuery } from '../hooks/use-media-files-query';
import type { useMediaSelection } from '../hooks/use-media-selection';
import type { useMediaUploads } from '../hooks/use-media-uploads';
import type { MediaFilePage, MediaFolder } from '@admin/media/model';

interface MediaFilesCardProps {
  filesQuery: ReturnType<typeof useMediaFilesQuery>;
  page: MediaFilePage | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  folders: readonly MediaFolder[];
  selection: ReturnType<typeof useMediaSelection>;
  fileActions: ReturnType<typeof useMediaFileActions>;
  uploads: ReturnType<typeof useMediaUploads>;
  targetLabel: string;
  onUpload: (files: readonly File[]) => void;
}

/** The right side of the library: drop zone, scope, toolbar, file grid, and pages. */
export function MediaFilesCard({
  error,
  fileActions,
  filesQuery,
  folders,
  loading,
  onRetry,
  onUpload,
  page,
  selection,
  targetLabel,
  uploads,
}: MediaFilesCardProps) {
  const pageCount = page ? Math.ceil(page.totalCount / page.pageSize) : 0;
  return (
    <Card sx={{ p: 2 }} variant="outlined">
      <MediaDropZone
        disabled={uploads.progress !== null}
        onFiles={onUpload}
        targetLabel={targetLabel}
      >
        <Stack spacing={2}>
          <MediaScopeBar
            folders={folders}
            includeSubfolders={filesQuery.includeSubfolders}
            onIncludeSubfoldersChange={filesQuery.setIncludeSubfolders}
            onSelect={filesQuery.setScope}
            scope={filesQuery.scope}
          />
          <MediaFilesToolbar
            onClearSelection={selection.clear}
            onMove={fileActions.moving.show}
            onSearch={filesQuery.setSearch}
            progress={uploads.progress}
            search={filesQuery.search}
            selectedCount={selection.selectedIds.size}
            totalCount={page?.totalCount}
          />
          <MediaFileGrid
            emptyText={
              filesQuery.query.search
                ? 'Нічого не знайдено. Змініть пошук.'
                : 'Тут ще немає файлів. Завантажте або перетягніть фото.'
            }
            error={error}
            files={page?.items ?? []}
            loading={loading}
            onOpen={fileActions.panel.open}
            onRetry={onRetry}
            onToggle={(file) => selection.toggle(file.id)}
            selectedIds={selection.selectedIds}
          />
          {pageCount > 1 ? (
            <Pagination
              count={pageCount}
              onChange={(_event, next) => filesQuery.setPage(next)}
              page={filesQuery.query.page}
              sx={{ alignSelf: 'center' }}
            />
          ) : null}
        </Stack>
      </MediaDropZone>
    </Card>
  );
}
