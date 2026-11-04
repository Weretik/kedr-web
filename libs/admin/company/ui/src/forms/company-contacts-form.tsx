import { SectionCard } from '@admin/shared/ui';
import { Alert, Box, Button, Stack } from '@mui/material';

import { ContactField } from './contact-field';

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

const twoColumns = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
} as const;

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
          <ContactField
            {...field}
            error={errors?.salesPhone}
            field="salesPhone"
            hint="У шапці, підвалі, на сторінках товарів і в кошику."
            inputMode="tel"
            label="Телефон відділу продажів"
          />
          <ContactField
            {...field}
            error={errors?.viberPhone}
            field="viberPhone"
            hint="Кнопка «Viber» на сайті відкриває чат з цим номером."
            inputMode="tel"
            label="Номер для Viber"
          />
          <ContactField
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
          <ContactField
            {...field}
            error={errors?.telegramUrl}
            field="telegramUrl"
            hint="Наприклад https://t.me/назва або https://t.me/+380…"
            inputMode="url"
            label="Посилання на Telegram"
          />
          <ContactField
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
          <ContactField
            {...field}
            error={errors?.cityUk}
            field="cityUk"
            hint="Українська версія сайту."
            label="Місто українською"
          />
          <ContactField
            {...field}
            error={errors?.cityRu}
            field="cityRu"
            hint="Російська версія сайту."
            label="Місто російською"
          />
        </Box>
      </SectionCard>
      {saveError ? <Alert severity="error">{saveError}</Alert> : null}
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={!dirty || saving} onClick={onReset}>
          Скасувати зміни
        </Button>
        <Button disabled={!dirty || saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </Stack>
    </Stack>
  );
}
