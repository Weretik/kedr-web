import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';

function TestHarness() {
  const location = useLocation();
  const navigate = useNavigate();
  const [preference, setPreference] = useState(
    () => localStorage.getItem('test-preference') ?? 'unset',
  );

  const continueJourney = () => {
    localStorage.setItem('test-preference', 'saved');
    setPreference('saved');
    void navigate('/verified');
  };

  return (
    <>
      <button type="button" onClick={continueJourney}>
        Continue
      </button>
      <output aria-label="Current path">{location.pathname}</output>
      <output aria-label="Stored preference">{preference}</output>
    </>
  );
}

describe('React Web test harness', () => {
  it('supports accessible user interaction, routing and browser storage', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/start']}>
        <TestHarness />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByLabelText('Current path')).toHaveTextContent('/verified');
    expect(screen.getByLabelText('Stored preference')).toHaveTextContent('saved');
    expect(localStorage.getItem('test-preference')).toBe('saved');
  });
});
