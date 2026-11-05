import { useGetCatalogAttributesQuery } from '@admin/catalog-attributes/data-access';
import { CatalogAttributesDataGrid } from '@admin/catalog-attributes/ui';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { Button, Card, Stack } from '@mui/material';
import { useState } from 'react';

import { AttributeEditPanel } from './attribute-edit-panel';
import { NewAttributePanel } from './new-attribute-panel';

interface AttributesTabProps {
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** The list of attributes; a row opens its panel (read-only for managers); Admins add new ones. */
export function AttributesTab({ canEdit, onNotice }: AttributesTabProps) {
  const query = useGetCatalogAttributesQuery();
  const [selectedId, setSelectedId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  return (
    <>
      {canEdit ? (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={() => setCreating(true)} startIcon={<AddOutlined />} variant="contained">
            Нова ознака
          </Button>
        </Stack>
      ) : null}
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
          onClose={() => setCreating(false)}
          onCreated={(attributeId) => {
            setCreating(false);
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
