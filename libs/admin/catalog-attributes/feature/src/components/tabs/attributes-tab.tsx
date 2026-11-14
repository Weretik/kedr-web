import {
  useGetCatalogAttributeQuery,
  useGetCatalogAttributesQuery,
} from '@admin/catalog-attributes/data-access';
import { AttributeList, AttributeOverview } from '@admin/catalog-attributes/ui';
import { Alert, Box, Button, Card, Skeleton } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { AttributeEditPanel } from '../panels/attribute-edit-panel';
import { NewAttributePanel } from '../panels/new-attribute-panel';

import type { CatalogAttributeValue } from '@admin/catalog-attributes/model';

interface AttributesTabProps {
  canEdit: boolean;
  /** The «Нова ознака» panel is open; the button sits beside the page tabs. */
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (message: string) => void;
}

/** What the right-side edit panel opens on; `opened` remounts it so it starts on the asked value. */
interface PanelState {
  opened: number;
  attributeId: number | undefined;
  value?: { value: CatalogAttributeValue | null };
}

/**
 * «Ознаки» (variant Б): attributes by role on the left, the chosen one on the right with all its values and codes;
 * changes open the right-side panel (read-only for managers). Admins add new ones from the page button.
 */
export function AttributesTab({
  canEdit,
  creating,
  onCreatingChange,
  onNotice,
}: AttributesTabProps) {
  const query = useGetCatalogAttributesQuery();
  const attributes = query.data ?? [];
  const [selectedId, setSelectedId] = useState<number>();
  const [panel, setPanel] = useState<PanelState>();
  const attributeId =
    attributes.find((item) => item.id === selectedId)?.id ??
    [...attributes].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.id;
  const details = useGetCatalogAttributeQuery(attributeId ?? skipToken);
  const open = (value?: CatalogAttributeValue | null, id = attributeId) =>
    setPanel({
      opened: (panel?.opened ?? 0) + 1,
      attributeId: id,
      value: value === undefined ? undefined : { value },
    });

  return (
    <>
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '300px minmax(0, 1fr)' },
        }}
      >
        <Card sx={{ p: 1 }} variant="outlined">
          <AttributeList
            attributes={attributes}
            error={query.isError}
            loading={query.isFetching}
            onRetry={() => query.refetch()}
            onSelect={setSelectedId}
            selectedId={attributeId}
          />
        </Card>
        {attributeId !== undefined ? (
          <Card sx={{ p: { xs: 2, md: 3 } }} variant="outlined">
            {details.isError ? (
              <Alert
                action={<Button onClick={() => details.refetch()}>Повторити</Button>}
                severity="error"
              >
                Не вдалося завантажити ознаку.
              </Alert>
            ) : details.data && details.data.attribute.id === attributeId ? (
              <AttributeOverview
                canEdit={canEdit}
                details={details.data}
                onEdit={() => open()}
                onEditValue={(value) => open(value)}
              />
            ) : (
              <Skeleton aria-label="Завантаження ознаки" height={320} variant="rounded" />
            )}
          </Card>
        ) : null}
      </Box>
      <AttributeEditPanel
        attributeId={panel?.attributeId ?? attributeId}
        canEdit={canEdit}
        initialValueEdit={panel?.value}
        key={panel?.opened ?? 0}
        onClose={() => setPanel(undefined)}
        onNotice={onNotice}
        open={panel !== undefined}
      />
      {canEdit ? (
        <NewAttributePanel
          onClose={() => onCreatingChange(false)}
          onCreated={(createdId) => {
            onCreatingChange(false);
            setSelectedId(createdId);
            open(undefined, createdId);
            onNotice('Ознаку створено.');
          }}
          open={creating}
        />
      ) : null}
    </>
  );
}
