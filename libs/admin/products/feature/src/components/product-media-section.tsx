import { mediaAcceptedTypes } from '@admin/media/model';
import { MediaPickerDialog } from '@admin/media/ui';
import { productMaxPhotos } from '@admin/products/model';
import { ProductMediaCard } from '@admin/products/ui';
import { SectionCard } from '@admin/shared/ui';
import { Alert, Button, Skeleton } from '@mui/material';

import { useMediaPicker } from '../hooks/use-media-picker';
import { useProductMediaEditor } from '../hooks/use-product-media-editor';

const accept = mediaAcceptedTypes.join(',');

/** «Фото та схема» on the product page: library picker, upload, order, and unlink. */
export function ProductMediaSection({ productId }: { productId: number }) {
  const editor = useProductMediaEditor(productId);
  const picker = useMediaPicker();

  if (editor.loadError)
    return (
      <SectionCard title="Фото та схема">
        <Alert action={<Button onClick={editor.retry}>Повторити</Button>} severity="error">
          Не вдалося завантажити фото товару.
        </Alert>
      </SectionCard>
    );
  if (editor.loading || !editor.media)
    return (
      <SectionCard title="Фото та схема">
        <Skeleton aria-label="Завантаження фото товару" height={160} variant="rounded" />
      </SectionCard>
    );

  return (
    <>
      <ProductMediaCard
        accept={accept}
        busy={editor.busy}
        error={editor.error}
        maxPhotos={productMaxPhotos}
        media={editor.media}
        onMovePhoto={(index, offset) => void editor.movePhoto(index, offset)}
        onPickPhotos={() => picker.open('photos')}
        onPickScheme={() => picker.open('scheme')}
        onRemovePhoto={(fileId) => void editor.removePhoto(fileId)}
        onRemoveScheme={() => void editor.setScheme(null)}
        onUploadPhotos={(files) => void editor.uploadPhotos(files)}
        onUploadScheme={(file) => void editor.uploadScheme(file)}
      />
      <MediaPickerDialog
        error={picker.error}
        files={picker.files}
        loading={picker.loading}
        multiple={picker.target === 'photos'}
        onCancel={picker.close}
        onConfirm={(files) => {
          const ids = files.map((file) => file.id);
          picker.close();
          void (picker.target === 'scheme'
            ? editor.setScheme(ids[0] ?? null)
            : editor.addPhotos(ids));
        }}
        onPageChange={picker.setPage}
        onRetry={picker.retry}
        onSearchChange={picker.setSearch}
        open={picker.target !== null}
        page={picker.page}
        pageCount={picker.pageCount}
        search={picker.search}
        title={picker.target === 'scheme' ? 'Схема з бібліотеки' : 'Фото з бібліотеки'}
      />
    </>
  );
}
