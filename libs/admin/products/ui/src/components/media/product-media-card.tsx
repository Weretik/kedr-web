import { SectionCard } from '@admin/shared/ui';
import { Alert } from '@mui/material';

import { ProductPhotosSection } from './product-photos-section';
import { ProductSchemeSection } from './product-scheme-section';

import type { ProductMedia } from '@admin/products/model';

interface ProductMediaCardProps {
  media: ProductMedia;
  maxPhotos: number;
  /** Accepted upload types; the backend checks the content. */
  accept: string;
  busy: boolean;
  error: string | null;
  onMovePhoto: (index: number, offset: -1 | 1) => void;
  onRemovePhoto: (fileId: number) => void;
  onPickPhotos: () => void;
  onUploadPhotos: (files: File[]) => void;
  onPickScheme: () => void;
  onUploadScheme: (file: File) => void;
  onRemoveScheme: () => void;
}

/** Photos (in site order, the first is the main one) and the scheme of a product, from the «Медіа» library. */
export function ProductMediaCard({
  accept,
  busy,
  error,
  maxPhotos,
  media,
  onMovePhoto,
  onPickPhotos,
  onPickScheme,
  onRemovePhoto,
  onRemoveScheme,
  onUploadPhotos,
  onUploadScheme,
}: ProductMediaCardProps) {
  return (
    <SectionCard title="Фото та схема">
      {error && <Alert severity="error">{error}</Alert>}
      <ProductPhotosSection
        accept={accept}
        busy={busy}
        maxPhotos={maxPhotos}
        onMove={onMovePhoto}
        onPick={onPickPhotos}
        onRemove={onRemovePhoto}
        onUpload={onUploadPhotos}
        photos={media.photos}
      />
      <ProductSchemeSection
        accept={accept}
        busy={busy}
        onPick={onPickScheme}
        onRemove={onRemoveScheme}
        onUpload={onUploadScheme}
        scheme={media.scheme}
      />
    </SectionCard>
  );
}
