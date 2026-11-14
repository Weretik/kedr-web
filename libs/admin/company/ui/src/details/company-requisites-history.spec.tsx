import { render, screen } from '@testing-library/react';

import { CompanyRequisitesHistory } from './company-requisites-history';

describe('CompanyRequisitesHistory', () => {
  it('says that nothing changed yet', () => {
    render(<CompanyRequisitesHistory entries={[]} />);

    expect(screen.getByText(/Змін ще не було/)).toBeTruthy();
  });

  it('shows who changed which field from what to what, with the IBAN grouped', () => {
    render(
      <CompanyRequisitesHistory
        entries={[
          {
            id: 1,
            changedAt: '2026-11-04T10:00:00Z',
            changedBy: 'admin@classkedr.com.ua',
            changes: [
              {
                field: 'iban',
                oldValue: 'UA303052990000026007025905216',
                newValue: 'UA213223130000026007233566001',
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByText(/admin@classkedr\.com\.ua/)).toBeTruthy();
    expect(screen.getByText('IBAN')).toBeTruthy();
    expect(screen.getByText('UA30 3052 9900 0002 6007 0259 0521 6')).toBeTruthy();
    expect(screen.getByText('UA21 3223 1300 0002 6007 2335 6600 1')).toBeTruthy();
  });
});
