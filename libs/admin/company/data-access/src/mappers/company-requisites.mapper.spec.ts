import {
  mapCompanyRequisites,
  mapCompanyRequisitesHistory,
  toSaveCompanyRequisitesBody,
} from './company-requisites.mapper';

describe('company requisites mapper', () => {
  it('sends trimmed values and the IBAN without spaces', () => {
    expect(
      toSaveCompanyRequisitesBody({
        legalName: ' ФОП Тест ',
        code: ' 12345678 ',
        registrationExtractNumber: '111 ',
        iban: 'ua30 3052 9900 0002 6007 0259 0521 6',
        bankName: ' ПриватБанк',
        bankCode: '305299 ',
      }),
    ).toEqual({
      legalName: 'ФОП Тест',
      code: '12345678',
      registrationExtractNumber: '111',
      iban: 'UA303052990000026007025905216',
      bankName: 'ПриватБанк',
      bankCode: '305299',
    });
  });

  it('rejects a response without the IBAN', () => {
    expect(() => mapCompanyRequisites({ legalName: 'ФОП' })).toThrow();
  });

  it('reads the change history', () => {
    const history = [
      {
        id: 2,
        changedAt: '2026-11-04T10:00:00Z',
        changedBy: 'admin@classkedr.com.ua',
        changes: [{ field: 'iban', oldValue: 'UA1', newValue: 'UA2' }],
      },
    ];

    expect(mapCompanyRequisitesHistory(history)).toEqual(history);
  });
});
