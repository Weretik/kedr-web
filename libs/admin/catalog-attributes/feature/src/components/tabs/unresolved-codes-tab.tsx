import {
  useDecideAttributeCodeMutation,
  useGetCodeProductsQuery,
  useGetUnresolvedCodesQuery,
} from '@admin/catalog-attributes/data-access';
import { codeDecisionNotice } from '@admin/catalog-attributes/model';
import { CodeQueueList, CodeWorkspace } from '@admin/catalog-attributes/ui';
import { Box, Card } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { ConnectedCodeMeaningRow } from './connected-code-meaning-row';
import { catalogAttributesErrorMessage } from '../../errors/catalog-attributes-error-message';

import type { CodeDecision } from '@admin/catalog-attributes/model';

interface UnresolvedCodesTabProps {
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/**
 * «Не розшифровані коди» (spec catalog/008, 009): the queue of codes on the left, the chosen code on the right with
 * its products by category; the owner decodes it as «ознака → значення» rows for all products or per category and
 * goes on to the next code.
 */
export function UnresolvedCodesTab({ canEdit, onNotice }: UnresolvedCodesTabProps) {
  const query = useGetUnresolvedCodesQuery();
  const codes = query.data ?? [];
  const [selectedId, setSelectedId] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const code = codes.find((item) => item.aliasId === selectedId) ?? codes[0];
  const products = useGetCodeProductsQuery(code?.aliasId ?? skipToken);
  const [decide, decideState] = useDecideAttributeCodeMutation();

  const select = (aliasId: number | undefined) => {
    setError(null);
    setSelectedId(aliasId);
  };
  const nextId = () => {
    const index = codes.findIndex((item) => item.aliasId === code?.aliasId);
    return codes[index + 1]?.aliasId ?? codes[0]?.aliasId;
  };

  const save = async (decision: CodeDecision) => {
    if (!code) return;
    setError(null);
    const next = nextId();
    try {
      const result = await decide({ aliasId: code.aliasId, decision }).unwrap();
      onNotice(codeDecisionNotice(result));
      select(next === code.aliasId ? undefined : next);
    } catch (failure) {
      setError(catalogAttributesErrorMessage(failure));
    }
  };

  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '300px minmax(0, 1fr)' },
      }}
    >
      <Card sx={{ p: 1 }} variant="outlined">
        <CodeQueueList
          codes={codes}
          error={query.isError}
          loading={query.isFetching}
          onRetry={() => query.refetch()}
          onSelect={select}
          selectedId={code?.aliasId}
        />
      </Card>
      {code ? (
        <Card sx={{ p: { xs: 2, md: 3 } }} variant="outlined">
          <CodeWorkspace
            canEdit={canEdit}
            code={code}
            error={error}
            key={code.aliasId}
            MeaningRow={ConnectedCodeMeaningRow}
            onRetry={() => products.refetch()}
            onSave={(decision) => void save(decision)}
            onSkip={() => select(nextId())}
            products={products.data}
            productsError={products.isError}
            productsLoading={products.isFetching}
            saving={decideState.isLoading}
          />
        </Card>
      ) : null}
    </Box>
  );
}
