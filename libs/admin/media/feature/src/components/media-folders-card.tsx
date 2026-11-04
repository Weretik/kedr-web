import { MediaFolderTreeView } from '@admin/media/ui';
import { Alert, Button, Card, Skeleton, Stack } from '@mui/material';

import type { MediaFolderTree, MediaScope } from '@admin/media/model';
import type { MediaFolderActions } from '@admin/media/ui';

interface MediaFoldersCardProps extends MediaFolderActions {
  tree: MediaFolderTree | undefined;
  loading: boolean;
  error: boolean;
  scope: MediaScope;
  onSelect: (scope: MediaScope) => void;
  expandedIds: ReadonlySet<number>;
  onToggle: (folderId: number) => void;
  onRetry: () => void;
}

/** Left column: the folder tree with its loading and error states; sticky on wide screens. */
export function MediaFoldersCard({
  error,
  loading,
  onRetry,
  tree,
  ...treeProps
}: MediaFoldersCardProps) {
  return (
    <Card
      sx={{
        maxHeight: { md: 'calc(100vh - 160px)' },
        overflowY: 'auto',
        p: 1.5,
        position: { md: 'sticky' },
        top: { md: 96 },
      }}
      variant="outlined"
    >
      {error ? (
        <Alert
          action={
            <Button color="inherit" onClick={onRetry} size="small">
              Повторити
            </Button>
          }
          severity="error"
        >
          Не вдалося завантажити папки.
        </Alert>
      ) : loading || !tree ? (
        <Stack spacing={1} sx={{ p: 1 }}>
          {[1, 2, 3].map((row) => (
            <Skeleton height={36} key={row} variant="rounded" />
          ))}
        </Stack>
      ) : (
        <MediaFolderTreeView tree={tree} {...treeProps} />
      )}
    </Card>
  );
}
