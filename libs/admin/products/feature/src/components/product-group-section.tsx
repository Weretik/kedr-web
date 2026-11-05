import { MoveToGroupDialog, NewGroupDialog, ProductGroupCard } from '@admin/products/ui';
import { SectionCard } from '@admin/shared/ui';
import { Alert, Button, Skeleton } from '@mui/material';

import { useProductGroupEditor } from '../hooks/use-product-group-editor';

interface ProductGroupSectionProps {
  productId: number;
  categoryId: number | null;
  /** Suggested name of a new group: the product's base name. */
  suggestedName: string;
}

/** «Група» in the product edit panel: variants and moves (spec catalog/006). */
export function ProductGroupSection({
  categoryId,
  productId,
  suggestedName,
}: ProductGroupSectionProps) {
  const editor = useProductGroupEditor(productId, categoryId);

  if (editor.loadError)
    return (
      <SectionCard title="Група">
        <Alert action={<Button onClick={editor.retry}>Повторити</Button>} severity="error">
          Не вдалося завантажити групу товару.
        </Alert>
      </SectionCard>
    );
  if (editor.loading || !editor.membership)
    return (
      <SectionCard title="Група">
        <Skeleton aria-label="Завантаження групи" height={80} variant="rounded" />
      </SectionCard>
    );

  return (
    <>
      <ProductGroupCard
        busy={editor.busy}
        error={editor.error}
        membership={editor.membership}
        onAutomatic={() => void editor.automatic()}
        onCreate={editor.openCreate}
        onMove={editor.openMove}
        onRemove={() => void editor.remove()}
        onSetMain={(memberId) => void editor.setMain(memberId)}
      />
      {editor.dialog === 'move' ? (
        <MoveToGroupDialog
          error={editor.dialogError}
          loading={editor.groupsLoading}
          onCancel={editor.closeDialog}
          onMove={(groupId) => void editor.moveTo(groupId)}
          onSearchChange={editor.setSearch}
          options={editor.groupOptions}
          saving={editor.busy}
        />
      ) : null}
      {editor.dialog === 'create' ? (
        <NewGroupDialog
          error={editor.dialogError}
          initialName={suggestedName}
          onCancel={editor.closeDialog}
          onCreate={(name) => void editor.createGroup(name)}
          saving={editor.busy}
        />
      ) : null}
    </>
  );
}
