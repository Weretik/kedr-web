import { companyRequisitesFieldLabels, formatIban } from '@admin/company/model';
import { SectionCard } from '@admin/shared/ui';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';

import type { CompanyRequisitesChange, CompanyRequisitesField } from '@admin/company/model';

interface CompanyRequisitesHistoryProps {
  entries: CompanyRequisitesChange[];
}

const dateFormat = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Kyiv',
});

const fieldLabel = (field: string) =>
  companyRequisitesFieldLabels[field as CompanyRequisitesField] ?? field;

const shown = (field: string, value: string) =>
  value ? (field === 'iban' ? formatIban(value) : value) : '—';

/** Who changed the requisites, when, and each field from the old value to the new one. */
export function CompanyRequisitesHistory({ entries }: CompanyRequisitesHistoryProps) {
  return (
    <SectionCard title="Історія змін">
      {entries.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Змін ще не було. Тут з’явиться кожне збереження: хто, коли і що змінив.
        </Typography>
      ) : (
        <Stack
          component="ol"
          divider={<Divider />}
          spacing={2}
          sx={{ listStyle: 'none', m: 0, p: 0 }}
        >
          {entries.map((entry) => (
            <Box component="li" key={entry.id}>
              <Typography sx={{ fontWeight: 700 }} variant="body2">
                {dateFormat.format(new Date(entry.changedAt))} · {entry.changedBy}
              </Typography>
              <Box
                component="dl"
                sx={{
                  display: 'grid',
                  gap: 0.5,
                  gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: '180px minmax(0, 1fr)' },
                  m: 0,
                  mt: 1,
                }}
              >
                {entry.changes.map((change) => (
                  <Fragment key={change.field}>
                    <Typography color="text.secondary" component="dt" variant="body2">
                      {fieldLabel(change.field)}
                    </Typography>
                    <Typography
                      component="dd"
                      sx={{ m: 0, overflowWrap: 'anywhere' }}
                      variant="body2"
                    >
                      <Box component="del" sx={{ color: 'text.secondary' }}>
                        {shown(change.field, change.oldValue)}
                      </Box>
                      {' → '}
                      <Box component="ins" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                        {shown(change.field, change.newValue)}
                      </Box>
                    </Typography>
                  </Fragment>
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
