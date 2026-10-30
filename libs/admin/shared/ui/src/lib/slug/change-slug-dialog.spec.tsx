import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ChangeSlugDialog } from './change-slug-dialog';
import { slugChangeErrorMessage, validateSlug } from './slug-rules';

const renderDialog = (onSubmit = vi.fn()) => {
  render(
    <ChangeSlugDialog
      currentSlug="zavisy"
      onClose={vi.fn()}
      onSubmit={onSubmit}
      open
      pathPrefix="/uk/catalog/"
      saving={false}
    />,
  );
  return onSubmit;
};

describe('validateSlug', () => {
  it('accepts lower-case words joined by single hyphens', () => {
    expect(validateSlug('zavisy-dverni-2')).toBeUndefined();
  });

  it.each(['', 'Zavisy', 'zavisy--2', '-zavisy', 'завіси', 'a'.repeat(81)])(
    'rejects %s',
    (value) => {
      expect(validateSlug(value)).toBeTruthy();
    },
  );
});

describe('ChangeSlugDialog', () => {
  it('shows the rule and sends nothing for an invalid address', () => {
    const onSubmit = renderDialog();

    fireEvent.change(screen.getByLabelText(/Адреса/), { target: { value: 'zavisy dverni' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(screen.getByText(/Лише малі латинські літери/)).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('sends a typed address or a regenerate request', () => {
    const onSubmit = renderDialog();

    fireEvent.change(screen.getByLabelText(/Адреса/), { target: { value: ' Zavisy-Dverni ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    fireEvent.click(screen.getByRole('button', { name: 'Згенерувати з назви' }));

    expect(onSubmit).toHaveBeenNthCalledWith(1, { slug: 'zavisy-dverni' });
    expect(onSubmit).toHaveBeenNthCalledWith(2, { regenerate: true });
  });
});

describe('slugChangeErrorMessage', () => {
  it('names a taken address', () => {
    expect(
      slugChangeErrorMessage({
        code: 'Validation',
        fieldErrors: { slug: ['This slug is used by another item now or was used before.'] },
      }),
    ).toMatch(/вже використовується/);
    expect(slugChangeErrorMessage({ code: 'Forbidden' })).toBe('Недостатньо прав для цієї дії.');
  });
});
