import { SectionCard } from '@admin/shared/ui';
import { Box, Typography } from '@mui/material';

import { DraftTextField } from './draft-text-field';
import { twoColumns } from './two-columns';

import type { CompanyContactsDraft, CompanyContactsErrors } from '@admin/company/model';

interface CompanyStoreFieldsProps {
  draft: CompanyContactsDraft;
  errors?: CompanyContactsErrors;
  onChange: (patch: Partial<CompanyContactsDraft>) => void;
}

const days = [
  { label: 'Пн–пт', opens: 'weekdaysOpens', closes: 'weekdaysCloses' },
  { label: 'Субота', opens: 'saturdayOpens', closes: 'saturdayCloses' },
  { label: 'Неділя', opens: 'sundayOpens', closes: 'sundayCloses' },
] as const;

/** The shop address and opening hours that search engines show for the business. */
export function CompanyStoreFields({ draft, errors, onChange }: CompanyStoreFieldsProps) {
  const field = { draft, onChange };

  return (
    <>
      <SectionCard title="Магазин">
        <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
          Пошукові системи показують ці дані у картці магазину. Без вулиці сайт їх не передає.
        </Typography>
        <Box sx={twoColumns}>
          <DraftTextField
            {...field}
            error={errors?.storeName}
            field="storeName"
            hint="Як у Google Maps."
            label="Назва магазину"
          />
          <DraftTextField
            {...field}
            error={errors?.postalCode}
            field="postalCode"
            hint="П’ять цифр."
            inputMode="numeric"
            label="Поштовий індекс"
          />
          <DraftTextField
            {...field}
            error={errors?.streetAddressUk}
            field="streetAddressUk"
            hint="Наприклад: вул. Ахієзерів, 46."
            label="Вулиця і будинок українською"
          />
          <DraftTextField
            {...field}
            error={errors?.streetAddressRu}
            field="streetAddressRu"
            hint="Російська версія сайту."
            label="Вулиця і будинок російською"
          />
          <DraftTextField
            {...field}
            error={errors?.regionUk}
            field="regionUk"
            hint="Наприклад: Харківська обл."
            label="Область українською"
          />
          <DraftTextField
            {...field}
            error={errors?.regionRu}
            field="regionRu"
            hint="Російська версія сайту."
            label="Область російською"
          />
        </Box>
      </SectionCard>
      <SectionCard title="Години роботи">
        <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
          День без годин — вихідний.
        </Typography>
        <Box sx={twoColumns}>
          {days.map((day) => [
            <DraftTextField
              {...field}
              error={errors?.[day.opens]}
              field={day.opens}
              hint="Відкриття."
              key={day.opens}
              label={`${day.label}: з`}
              time
            />,
            <DraftTextField
              {...field}
              error={errors?.[day.closes]}
              field={day.closes}
              hint="Закриття."
              key={day.closes}
              label={`${day.label}: до`}
              time
            />,
          ])}
        </Box>
      </SectionCard>
    </>
  );
}
