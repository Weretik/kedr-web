import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { ProductImageCard } from './product-image-card';
import { ProductImagePreviewDialog } from './product-image-preview-dialog';
import { ProductInformationCard } from './product-information-card';

import type { ProductDetails } from '@admin/products/model';

type Preview = 'photo' | 'scheme' | null;

interface ProductDetailsContentProps {
  product: ProductDetails;
  publicUrl: string | null;
  photoStorageUrl: string;
  onAddProduct?: (productId: number) => void;
}

export function ProductDetailsContent({ product, publicUrl, photoStorageUrl, onAddProduct }: ProductDetailsContentProps) {
  const [schemeFailed, setSchemeFailed] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [preview, setPreview] = useState<Preview>(null);
  useEffect(() => { setSchemeFailed(false); setPhotoFailed(false); setPreview(null); }, [product.id, product.photo, product.scheme]);
  const showScheme = Boolean(product.scheme) && !schemeFailed;

  return (
    <>
      <Box sx={{
        display: 'grid', gap: 3, minWidth: 0,
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: showScheme ? 'minmax(200px, 260px) minmax(0, 1fr) minmax(200px, 260px)' : 'minmax(220px, 280px) minmax(0, 1fr)',
        },
      }}>
        <ProductImageCard failed={photoFailed} kind="photo" onError={() => setPhotoFailed(true)} onPreview={() => setPreview('photo')} src={product.photo} />
        <ProductInformationCard product={product} publicUrl={publicUrl} photoStorageUrl={photoStorageUrl} onAddProduct={onAddProduct} />
        {showScheme && (
          <ProductImageCard kind="scheme" onError={() => setSchemeFailed(true)} onPreview={() => setPreview('scheme')} src={product.scheme} />
        )}
      </Box>
      <ProductImagePreviewDialog onClose={() => setPreview(null)} preview={preview} product={product} />
    </>
  );
}
