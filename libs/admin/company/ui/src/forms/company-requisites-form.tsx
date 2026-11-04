import { companyRequisitesFieldLabels as labels } from '@admin/company/model';
import { SectionCard } from '@admin/shared/ui';
import { Box, Stack } from '@mui/material';

import { DraftTextField } from './draft-text-field';
import { FormSaveBar } from './form-save-bar';
import { twoColumns } from './two-columns';

import type { CompanyRequisitesDraft, CompanyRequisitesErrors } from '@admin/company/model';
import type { FormEvent } from 'react';

interface CompanyRequisitesFormProps {
  draft: CompanyRequisitesDraft;
  errors?: CompanyRequisitesErrors;
  dirty: boolean;
  saving: boolean;
  /** Server error in the words of the page. */
  saveError?: string;
  onChange: (draft: CompanyRequisitesDraft) => void;
  onReset: () => void;
  onSave: () => void;
}

/** The ФОП, its codes and the bank account, saved together. */
export function CompanyRequisitesForm({
  dirty,
  draft,
  errors,
  onChange,
  onReset,
  onSave,
  saveError,
  saving,
}: CompanyRequisitesFormProps) {
  const set = (patch: Partial<CompanyRequisitesDraft>) => onChange({ ...draft, ...patch });
  const field = { draft, onChange: set };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} spacing={3}>
      <SectionCard title="Підприємець">
        <Stack spacing={2}>
          <DraftTextField
            {...field}
            error={errors?.legalName}
            field="legalName"
            hint="Повністю, як у витягу: «ФОП Прізвище Ім'я По батькові»."
            label={labels.legalName}
          />
          <Box sx={twoColumns}>
            <DraftTextField
              {...field}
              error={errors?.code}
              field="code"
              hint="ЄДРПОУ — 8 цифр, РНОКПП — 10 цифр."
              inputMode="numeric"
              label={labels.code}
            />
            <DraftTextField
              {...field}
              error={errors?.registrationExtractNumber}
              field="registrationExtractNumber"
              hint="Номер витягу з ЄДР, лише цифри."
              inputMode="numeric"
              label={labels.registrationExtractNumber}
            />
          </Box>
        </Stack>
      </SectionCard>
      <SectionCard title="Банківський рахунок">
        <Stack spacing={2}>
          <DraftTextField
            {...field}
            error={errors?.iban}
            field="iban"
            hint="Можна з пробілами. Контрольні цифри перевіряються при збереженні."
            label={labels.iban}
          />
          <Box sx={twoColumns}>
            <DraftTextField
              {...field}
              error={errors?.bankName}
              field="bankName"
              hint="Коротка назва, наприклад «ПриватБанк»."
              label={labels.bankName}
            />
            <DraftTextField
              {...field}
              error={errors?.bankCode}
              field="bankCode"
              hint="6 цифр; мають збігатися з цифрами 5–10 IBAN."
              inputMode="numeric"
              label={labels.bankCode}
            />
          </Box>
        </Stack>
      </SectionCard>
      <FormSaveBar dirty={dirty} onReset={onReset} saveError={saveError} saving={saving} />
    </Stack>
  );
}
