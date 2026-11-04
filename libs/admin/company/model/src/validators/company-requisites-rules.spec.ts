import {
  bankCodeFromIban,
  hasValidIbanChecksum,
  validateCompanyRequisitesDraft,
} from './company-requisites-rules';
import { formatIban, normalizeIban } from '../forms/company-requisites-draft';

import type { CompanyRequisitesDraft } from '../forms/company-requisites-draft';

const valid: CompanyRequisitesDraft = {
  legalName: 'ФОП Овчинников Максим Володимирович',
  code: '2689400771',
  registrationExtractNumber: '24800170000032534',
  iban: 'UA30 3052 9900 0002 6007 0259 0521 6',
  bankName: 'ПриватБанк',
  bankCode: '305299',
};

describe('company requisites rules', () => {
  it('accepts the current requisites typed with spaces in the IBAN', () => {
    expect(validateCompanyRequisitesDraft(valid)).toBeUndefined();
  });

  it('normalizes and groups the IBAN', () => {
    expect(normalizeIban(' ua30 3052 99 ')).toBe('UA30305299');
    expect(formatIban('UA303052990000026007025905216')).toBe(
      'UA30 3052 9900 0002 6007 0259 0521 6',
    );
  });

  it('checks the IBAN checksum and reads the bank code from it', () => {
    expect(hasValidIbanChecksum('UA303052990000026007025905216')).toBe(true);
    expect(hasValidIbanChecksum('UA303052990000026007025905217')).toBe(false);
    expect(bankCodeFromIban('UA30 3052 9900 0002 6007 0259 0521 6')).toBe('305299');
    expect(bankCodeFromIban('UA30')).toBeUndefined();
  });

  it('rejects a typo in the IBAN', () => {
    expect(
      validateCompanyRequisitesDraft({ ...valid, iban: 'UA303052990000026007025905217' })?.iban,
    ).toMatch('Контрольні цифри');
  });

  it('reports a bank code that differs from the IBAN on the bank code', () => {
    const errors = validateCompanyRequisitesDraft({ ...valid, bankCode: '300001' });

    expect(errors?.bankCode).toBe('У цьому IBAN МФО 305299.');
    expect(errors?.iban).toBeUndefined();
  });

  it('accepts ЄДРПОУ and РНОКПП and rejects other lengths', () => {
    expect(validateCompanyRequisitesDraft({ ...valid, code: '12345678' })).toBeUndefined();
    expect(validateCompanyRequisitesDraft({ ...valid, code: '123456789' })?.code).toBeTruthy();
  });

  it('requires every field', () => {
    const errors = validateCompanyRequisitesDraft({
      legalName: ' ',
      code: '',
      registrationExtractNumber: '',
      iban: '',
      bankName: '',
      bankCode: '',
    });

    expect(Object.keys(errors ?? {})).toHaveLength(6);
  });
});
