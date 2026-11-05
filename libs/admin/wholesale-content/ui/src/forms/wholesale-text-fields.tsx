import { CountedTextField, SectionCard } from '@admin/shared/ui';
import { wholesaleLimits, wholesaleTextFields } from '@admin/wholesale-content/model';
import { Stack, Typography } from '@mui/material';

import { WholesaleFaqEditor } from '../faq/wholesale-faq-editor';

import type {
  WholesaleStep,
  WholesaleText,
  WholesaleTextErrors,
  WholesaleTextField,
} from '@admin/wholesale-content/model';
import type { ReactNode } from 'react';

interface WholesaleTextFieldsProps {
  text: WholesaleText;
  errors?: WholesaleTextErrors;
  onChange: (text: WholesaleText) => void;
}

const labels: Record<WholesaleTextField, string> = {
  heroTitle: 'Заголовок',
  heroLead: 'Опис під заголовком',
  contactCardTitle: 'Заголовок картки з контактами',
  contactCardNote: 'Примітка в картці',
  assortmentTitle: 'Заголовок',
  assortmentIntro: 'Опис над розділами каталогу',
  companyTitle: 'Заголовок після назви компанії',
  companyText: 'Текст',
  selectionTitle: 'Перша перевага: заголовок',
  selectionText: 'Перша перевага: текст',
  warehouseTitle: 'Друга перевага: заголовок',
  warehouseText: 'Друга перевага: текст',
  stepsTitle: 'Заголовок',
  faqTitle: 'Заголовок',
  closingTitle: 'Заголовок',
};

const hints: Partial<Record<WholesaleTextField, string>> = {
  companyTitle: 'На сайті: «Class Kedr — …», тому з малої літери.',
  closingTitle: 'Блок з кнопкою «Зв’язатися з менеджером» унизу сторінки.',
};

const multiline = new Set<WholesaleTextField>(['heroLead', 'companyText']);

/** Every text of one language, grouped as the blocks of the page from the top. */
export function WholesaleTextFields({ errors, onChange, text }: WholesaleTextFieldsProps) {
  const field = (name: WholesaleTextField) => (
    <CountedTextField
      error={errors?.fields?.[name]}
      hint={hints[name]}
      label={labels[name]}
      maxLength={wholesaleTextFields[name]}
      multiline={multiline.has(name)}
      onChange={(value) => onChange({ ...text, [name]: value })}
      value={text[name]}
    />
  );
  const setStep = (index: number, patch: Partial<WholesaleStep>) =>
    onChange({
      ...text,
      steps: text.steps.map((step, position) =>
        position === index ? { ...step, ...patch } : step,
      ),
    });
  const block = (title: string, children: ReactNode) => (
    <SectionCard title={title}>
      <Stack spacing={2}>{children}</Stack>
    </SectionCard>
  );

  return (
    <Stack spacing={3}>
      {block(
        'Перший екран',
        <>
          {field('heroTitle')}
          {field('heroLead')}
          {field('contactCardTitle')}
          {field('contactCardNote')}
        </>,
      )}
      {block(
        'Асортимент',
        <>
          {field('assortmentTitle')}
          {field('assortmentIntro')}
        </>,
      )}
      {block(
        'Про компанію',
        <>
          {field('companyTitle')}
          {field('companyText')}
          {field('selectionTitle')}
          {field('selectionText')}
          {field('warehouseTitle')}
          {field('warehouseText')}
        </>,
      )}
      {block(
        'Як замовити',
        <>
          {field('stepsTitle')}
          {text.steps.map((step, index) => (
            <Stack key={index} spacing={1.5}>
              <Typography sx={{ fontWeight: 600 }} variant="body2">
                {`Крок ${index + 1}`}
              </Typography>
              <CountedTextField
                error={errors?.steps?.[index]?.title}
                label="Назва кроку"
                maxLength={wholesaleLimits.shortTitle}
                onChange={(title) => setStep(index, { title })}
                value={step.title}
              />
              <CountedTextField
                error={errors?.steps?.[index]?.text}
                label="Опис кроку"
                maxLength={wholesaleLimits.shortText}
                onChange={(value) => setStep(index, { text: value })}
                value={step.text}
              />
            </Stack>
          ))}
        </>,
      )}
      {block(
        'Питання оптових покупців',
        <>
          {field('faqTitle')}
          <WholesaleFaqEditor
            countError={errors?.faqCount}
            errors={errors?.faq}
            items={text.faq}
            onChange={(faq) => onChange({ ...text, faq })}
          />
        </>,
      )}
      {block('Заклик унизу', field('closingTitle'))}
    </Stack>
  );
}
