import { useGetCatalogAttributesQuery } from '@admin/catalog-attributes/data-access';
import { CatalogAttributesDataGrid } from '@admin/catalog-attributes/ui';
import { Card } from '@mui/material';
import { useState } from 'react';

import { AttributeEditPanel } from './attribute-edit-panel';

interface AttributesTabProps {
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** The list of properties; a row opens its panel (read-only for managers). */
export function AttributesTab({ canEdit, onNotice }: AttributesTabProps) {
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
    </>
  );
}
