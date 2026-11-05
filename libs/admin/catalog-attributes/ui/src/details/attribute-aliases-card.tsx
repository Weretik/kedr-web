import { SectionCard, StatusPill } from '@admin/shared/ui';
import { Stack, Typography } from '@mui/material';

import type { CatalogAttributeAlias, CatalogAttributeValue } from '@admin/catalog-attributes/model';

interface AttributeAliasesCardProps {
  aliases: readonly CatalogAttributeAlias[];
  values: readonly CatalogAttributeValue[];
}

/** How the values are written in 1C names; only problems are marked. */
export function AttributeAliasesCard({ aliases, values }: AttributeAliasesCardProps) {
  const names = new Map(values.map((value) => [value.id, value.nameUk]));

  return (
    <SectionCard title={`Написання в 1С (${aliases.length})`}>
      {aliases.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Написань немає.
        </Typography>
      ) : (
        <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {aliases.map((alias) => (
            <Stack
              component="li"
              direction="row"
              key={alias.id}
              spacing={1.5}
              sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
              useFlexGap
            >
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }} variant="body2">
                {alias.rawValue}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {alias.valueId === null ? '—' : `→ ${names.get(alias.valueId) ?? alias.valueId}`}
              </Typography>
              {alias.scope !== 'general' ? (
                <Typography color="text.secondary" variant="caption">
                  {alias.scope}
                </Typography>
              ) : null}
              {alias.valueId === null ? (
                <StatusPill label="Не розшифровано" tone="error" />
              ) : alias.isConfirmed ? null : (
                <StatusPill label="Не підтверджено" tone="warning" />
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
