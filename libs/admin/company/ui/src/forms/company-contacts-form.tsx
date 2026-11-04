import { SectionCard } from '@admin/shared/ui';
import { Box, Stack } from '@mui/material';

import { DraftTextField } from './draft-text-field';
import { FormSaveBar } from './form-save-bar';
import { twoColumns } from './two-columns';

import type { CompanyContactsDraft, CompanyContactsErrors } from '@admin/company/model';
import type { FormEvent } from 'react';

interface CompanyContactsFormProps {
  draft: CompanyContactsDraft;
  errors?: CompanyContactsErrors;
  dirty: boolean;
  saving: boolean;
  /** Server error in the words of the page. */
  saveError?: string;
  onChange: (draft: CompanyContactsDraft) => void;
  onReset: () => void;
  onSave: () => void;
}

/** Phones, email, messenger and map links, and the city in both languages, saved together. */
export function CompanyContactsForm({
  dirty,
  draft,
  errors,
  onChange,
  onReset,
  onSave,
  saveError,
  saving,
}: CompanyContactsFormProps) {
  const set = (patch: Partial<CompanyContactsDraft>) => onChange({ ...draft, ...patch });
  const field = { draft, onChange: set };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} spacing={3}>
      <SectionCard title="Телефони і пошта">
        <Box sx={twoColumns}>
          <DraftTextField
            {...field}
            error={errors?.salesPhone}
            field="salesPhone"
            hint="У шапці, підвалі, на сторінках товарів і в кошику."
            inputMode="tel"
            label="Телефон відділу продажів"
          />
          <DraftTextField
            {...field}
            error={errors?.viberPhone}
            field="viberPhone"
            hint="Кнопка «Viber» на сайті відкриває чат з цим номером."
            inputMode="tel"
            label="Номер для Viber"
          />
          <DraftTextField
            {...field}
            error={errors?.email}
            field="email"
            hint="У підвалі, на сторінці контактів і в юридичних текстах."
            inputMode="email"
            label="Email"
          />
        </Box>
      </SectionCard>
      <SectionCard title="Месенджери і карта">
        <Box sx={twoColumns}>
          <DraftTextField
            {...field}
            error={errors?.telegramUrl}
            field="telegramUrl"
            hint="Наприклад https://t.me/назва або https://t.me/+380…"
            inputMode="url"
            label="Посилання на Telegram"
          />
          <DraftTextField
            {...field}
            error={errors?.mapUrl}
            field="mapUrl"
            hint="Посилання «Як нас знайти» з Google Maps."
            inputMode="url"
            label="Посилання на карту"
          />
        </Box>
      </SectionCard>
      <SectionCard title="Місто">
        <Box sx={twoColumns}>
          <DraftTextField
            {...field}
            error={errors?.cityUk}
            field="cityUk"
            hint="Українська версія сайту."
            label="Місто українською"
          />
          <DraftTextField
            {...field}
            error={errors?.cityRu}
            field="cityRu"
            hint="Російська версія сайту."
            label="Місто російською"
          />
        </Box>
      </SectionCard>
      <FormSaveBar dirty={dirty} onReset={onReset} saveError={saveError} saving={saving} />
    </Stack>
  );
}
