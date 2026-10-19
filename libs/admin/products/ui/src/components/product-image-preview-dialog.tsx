import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';

import type { ProductDetails } from '@admin/products/model';

interface ProductImagePreviewDialogProps {
  onClose: () => void;
  preview: 'photo' | 'scheme' | null;
  product: Pick<ProductDetails, 'photo' | 'scheme'>;
}

export function ProductImagePreviewDialog({ onClose, preview, product }: ProductImagePreviewDialogProps) {
  return (
    <Dialog aria-labelledby="product-image-dialog-title" maxWidth="lg" onClose={onClose} open={preview !== null}>
      <DialogTitle id="product-image-dialog-title">{preview === 'scheme' ? 'Схема товару' : 'Фото товару'}</DialogTitle>
      <DialogContent>
        <Box alt={preview === 'scheme' ? 'Збільшена схема товару' : 'Збільшене фото товару'} component="img" src={preview === 'scheme' ? product.scheme : product.photo} sx={{ display: 'block', maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain' }} />
      </DialogContent>
    </Dialog>
  );
}
