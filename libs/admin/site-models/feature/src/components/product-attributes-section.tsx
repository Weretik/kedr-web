import { SectionCard } from '@admin/shared/ui';
import {
  ProductAttributeDialog,
  ProductAttributesCard,
  ProductReviewCard,
} from '@admin/site-models/ui';
import { Alert, Button, Skeleton } from '@mui/material';

import { useProductAttributesEditor } from '../hooks/use-product-attributes-editor';

/** «Ознаки» and «Перевірка» in the product edit panel (spec catalog/006). */
export function ProductAttributesSection({ productId }: { productId: number }) {
  const editor = useProductAttributesEditor(productId);

  if (editor.loadError)
    return (
      <SectionCard title="Ознаки">
        <Alert action={<Button onClick={editor.retry}>Повторити</Button>} severity="error">
          Не вдалося завантажити ознаки товару.
        </Alert>
      </SectionCard>
    );
  if (editor.loading || !editor.data)
    return (
      <SectionCard title="Ознаки">
        <Skeleton aria-label="Завантаження ознак" height={120} variant="rounded" />
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
