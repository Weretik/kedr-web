import {
  ProductAttributeDialog,
  ProductAttributesCard,
  ProductReviewCard,
} from '@admin/products/ui';
import { SectionCard } from '@admin/shared/ui';
import { Alert, Button, Skeleton } from '@mui/material';

import { useProductAttributesEditor } from '../hooks/use-product-attributes-editor';

/** «Властивості» and «Перевірка» in the product edit panel (spec catalog/006). */
export function ProductAttributesSection({ productId }: { productId: number }) {
  const editor = useProductAttributesEditor(productId);

  if (editor.loadError)
    return (
      <SectionCard title="Властивості">
        <Alert action={<Button onClick={editor.retry}>Повторити</Button>} severity="error">
          Не вдалося завантажити властивості товару.
        </Alert>
      </SectionCard>
    );
  if (editor.loading || !editor.data)
    return (
      <SectionCard title="Властивості">
        <Skeleton aria-label="Завантаження властивостей" height={120} variant="rounded" />
      </SectionCard>
    );

  return (
    <>
      <ProductReviewCard
        busy={editor.reviewBusy}
        error={editor.reviewError}
        onAccept={() => void editor.accept()}
        onReopen={() => void editor.reopen()}
        review={editor.data.review}
      />
      <ProductAttributesCard
        busy={editor.busy}
        data={editor.data}
        error={editor.error}
        onAdd={editor.openAdd}
        onEdit={editor.openEdit}
        onRestore={(attribute) => void editor.restore(attribute)}
      />
      {editor.dialog ? (
        <ProductAttributeDialog
          attribute={editor.dialog.attribute}
          attributeOptions={editor.attributeOptions}
          error={editor.dialogError}
          key={editor.dialog.attribute?.attributeId ?? 'new'}
          onAttributeChange={editor.chooseAttribute}
          onCancel={editor.closeDialog}
          onSave={(attributeId, input) => void editor.save(attributeId, input)}
          saving={editor.saving}
          valueOptions={editor.valueOptions}
          valuesLoading={editor.valuesLoading}
        />
      ) : null}
    </>
  );
}
