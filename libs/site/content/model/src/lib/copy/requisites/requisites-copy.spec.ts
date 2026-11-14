import { formatRequisitesCopy } from './requisites-copy';
import { getRequisitesDictionary } from './requisites-dictionary';

import type { RequisitesDetails, RequisitesValues } from './requisites-types';

// Synthetic unit fixtures only; they are not payment data and do not confirm EN-001.
const values: RequisitesValues = Object.freeze({
  legalName: 'ТЕСТ: ФОП «Зразок» Й. І.',
  code: '0001234567',
  registrationExtractNumber: '0000001234567890',
  iban: 'ua00 001_TEST-02',
  bankName: 'ТЕСТ — АТ «Банк»',
  bankCode: '000001',
});

it.each([
  {
    locale: 'uk' as const,
    expected: [
      'Найменування: ТЕСТ: ФОП «Зразок» Й. І.',
      'Код: 0001234567',
      'Виписка: № 0000001234567890',
      'IBAN: ua00 001_TEST-02',
      'Банк: ТЕСТ — АТ «Банк»',
      'МФО: 000001',
    ].join('\n'),
  },
  {
    locale: 'ru' as const,
    expected: [
      'Наименование: ТЕСТ: ФОП «Зразок» Й. І.',
      'Код: 0001234567',
      'Выписка: № 0000001234567890',
      'IBAN: ua00 001_TEST-02',
      'Банк: ТЕСТ — АТ «Банк»',
      'МФО: 000001',
    ].join('\n'),
  },
])('formats exactly six LF-separated lines with $locale labels', ({ locale, expected }) => {
  const dictionary = getRequisitesDictionary(locale);
  const result = formatRequisitesCopy(values, dictionary.fields);

  expect(dictionary.locale).toBe(locale);
  expect(result).toBe(expected);
  expect(result.split('\n')).toHaveLength(6);
  expect(result).not.toContain('\r');
  expect(result.endsWith('\n')).toBe(false);
});

it('preserves original spaces, casing, punctuation and leading zeroes without mutation', () => {
  const original: RequisitesValues = Object.freeze({
    ...values,
    legalName: '  ТЕСТ «Й»  ',
    iban: '  ua00-TEST 001  ',
  });
  const result = formatRequisitesCopy(original, getRequisitesDictionary('uk').fields);

  expect(result.split('\n')[0]).toBe('Найменування:   ТЕСТ «Й»  ');
  expect(result.split('\n')[1]).toBe('Код: 0001234567');
  expect(result.split('\n')[3]).toBe('IBAN:   ua00-TEST 001  ');
  expect(original.iban).toBe('  ua00-TEST 001  ');
  expect(original.registrationExtractNumber).toBe('0000001234567890');
});

it('copies the official fields without adding the separate contact details', () => {
  const details: RequisitesDetails = {
    ...values,
    phone: { display: 'ТЕСТ телефон', e164: '+000000000000' },
  };
  const result = formatRequisitesCopy(details, getRequisitesDictionary('uk').fields);

  expect(result.split('\n')).toHaveLength(6);
  expect(result).not.toContain(details.phone.display);
  expect(result).not.toContain(details.phone.e164);
});

it('uses the supplied code label without inventing a legal code category', () => {
  const labels = { ...getRequisitesDictionary('uk').fields, code: 'Підтверджений код' };

  expect(formatRequisitesCopy(values, labels).split('\n')[1]).toBe('Підтверджений код: 0001234567');
});
