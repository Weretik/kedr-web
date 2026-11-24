import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TaskDescriptionButton } from './task-description-button';

describe('TaskDescriptionButton', () => {
  it('hides the description until «Що робить?» is pressed', () => {
    render(
      <TaskDescriptionButton task={{ name: 'Синхронізація', description: 'Що робить: тест' }} />,
    );

    expect(screen.queryByText('Що робить: тест')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Що робить задача/ }));
    expect(screen.getByText('Що робить: тест')).toBeTruthy();
  });
});
