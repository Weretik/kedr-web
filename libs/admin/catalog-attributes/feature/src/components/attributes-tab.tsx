import { useGetCatalogAttributesQuery } from '@admin/catalog-attributes/data-access';
import { CatalogAttributesDataGrid } from '@admin/catalog-attributes/ui';
import { Card } from '@mui/material';
import { useState } from 'react';

import { AttributeEditPanel } from './attribute-edit-panel';
import { NewAttributePanel } from './new-attribute-panel';

interface AttributesTabProps {
  canEdit: boolean;
  /** The «Нова ознака» panel is open; the button sits beside the page tabs. */
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (message: string) => void;
}

/** The list of attributes; a row opens its panel (read-only for managers); Admins add new ones from the page button. */
export function AttributesTab({
  canEdit,
  creating,
  onCreatingChange,
  onNotice,
}: AttributesTabProps) {
  const query = useGetCatalogAttributesQuery();
  const [selectedId, setSelectedId] = useState<number>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <CatalogAttributesDataGrid
          canEdit={canEdit}
          error={query.isError}
          loading={query.isFetching}
          onOpen={(attribute) => {
            setSelectedId(attribute.id);
            setOpen(true);
          }}
          onRetry={() => query.refetch()}
          rows={query.data ?? []}
        />
      </Card>
      <AttributeEditPanel
        attributeId={selectedId}
        canEdit={canEdit}
        onClose={() => setOpen(false)}
        onNotice={onNotice}
        open={open}
      />
      {canEdit ? (
        <NewAttributePanel
          onClose={() => onCreatingChange(false)}
          onCreated={(attributeId) => {
            onCreatingChange(false);
            setSelectedId(attributeId);
            setOpen(true);
            onNotice('Ознаку створено.');
          }}
          open={creating}
        />
      ) : null}
    </>
  );
}
