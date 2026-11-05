import {
  useDecideAttributeCodeMutation,
  useGetCatalogAttributeQuery,
  useGetUnresolvedCodesQuery,
} from '@admin/catalog-attributes/data-access';
import { codeDecisionNotice } from '@admin/catalog-attributes/model';
import { CodeDecisionDialog, UnresolvedCodesDataGrid } from '@admin/catalog-attributes/ui';
import { Card } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { catalogAttributesErrorMessage } from '../errors/catalog-attributes-error-message';

import type { UnresolvedCode } from '@admin/catalog-attributes/model';

interface UnresolvedCodesTabProps {
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** «Не розшифровані коди»: the owner decides what each 1C code means. */
export function UnresolvedCodesTab({ canEdit, onNotice }: UnresolvedCodesTabProps) {
  const query = useGetUnresolvedCodesQuery();
  const [code, setCode] = useState<UnresolvedCode>();
  const [error, setError] = useState<string | null>(null);
  const values = useGetCatalogAttributeQuery(code?.attributeId ?? skipToken);
  const [decide, decideState] = useDecideAttributeCodeMutation();

  const save = async (valueId: number | null) => {
    if (!code) return;
    setError(null);
    try {
      const result = await decide({ aliasId: code.aliasId, decision: { valueId } }).unwrap();
      setCode(undefined);
      onNotice(codeDecisionNotice(result));
    } catch (failure) {
      setError(catalogAttributesErrorMessage(failure));
    }
  };

  return (
    <>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <UnresolvedCodesDataGrid
          canEdit={canEdit}
          error={query.isError}
          loading={query.isFetching}
          onDecide={(next) => {
            setError(null);
            setCode(next);
          }}
          onRetry={() => query.refetch()}
          rows={query.data ?? []}
        />
      </Card>
      {code ? (
        <CodeDecisionDialog
          code={code}
          error={error}
          key={code.aliasId}
          onCancel={() => setCode(undefined)}
          onSave={(valueId) => void save(valueId)}
          saving={decideState.isLoading}
          values={values.data?.values ?? []}
          valuesLoading={values.isFetching}
        />
      ) : null}
    </>
  );
}
