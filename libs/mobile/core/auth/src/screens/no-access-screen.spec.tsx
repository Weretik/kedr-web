import { fireEvent, render, screen } from '@testing-library/react-native';

import { NoAccessScreen } from './no-access-screen';
import { logout } from '../session/mobile-auth';

jest.mock('../session/mobile-auth', () => ({ logout: jest.fn() }));

describe('NoAccessScreen (SC-002)', () => {
  it('offers only «Вийти»', async () => {
    await render(<NoAccessScreen />);

    expect(screen.getByText('Немає доступу')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await fireEvent.press(screen.getByRole('button', { name: 'Вийти' }));
    expect(logout).toHaveBeenCalled();
  });
});
