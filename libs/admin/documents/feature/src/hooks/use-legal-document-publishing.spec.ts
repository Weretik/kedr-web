import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLegalDocumentPublishing } from './use-legal-document-publishing';

const setup = (overrides: Partial<Parameters<typeof useLegalDocumentPublishing>[0]> = {}) => {
  const actions = {
    publishDraft: vi.fn(() => Promise.resolve()),
    discardDraft: vi.fn(() => Promise.resolve()),
    ...overrides,
  };
  return { actions, ...renderHook(() => useLegalDocumentPublishing(actions)) };
};

describe('useLegalDocumentPublishing', () => {
  it('opens the publish dialog with a fresh round each time', () => {
    const { result } = setup();
    act(() => result.current.publish.start());
    const first = result.current.publish.round;
    act(() => result.current.publish.cancel());
    act(() => result.current.publish.start());
    expect(result.current.publish.open).toBe(true);
    expect(result.current.publish.round).toBe(first + 1);
  });

  it('publishes, closes the dialog, and tells when the site changes', async () => {
    const { result, actions } = setup();
    act(() => result.current.publish.start());
    await act(() => result.current.publish.confirm('2026-11-14'));
    expect(actions.publishDraft).toHaveBeenCalledWith('2026-11-14');
    expect(result.current.publish.open).toBe(false);
    expect(result.current.notice).toBe(
      'Опубліковано. На сайті зміни з’являться протягом 10 хвилин.',
    );
  });

  it('keeps the publish dialog open with the server message on failure', async () => {
    const { result } = setup({
      publishDraft: vi.fn(() => Promise.reject(new Error('Дата раніша'))),
    });
    act(() => result.current.publish.start());
    await act(() => result.current.publish.confirm('2026-01-01'));
    expect(result.current.publish.open).toBe(true);
    expect(result.current.publish.error).toBe('Дата раніша');
  });

  it('discards the draft and reports it', async () => {
    const { result, actions } = setup();
    act(() => result.current.discard.start());
    await act(() => result.current.discard.confirm());
    expect(actions.discardDraft).toHaveBeenCalledOnce();
    expect(result.current.discard.open).toBe(false);
    expect(result.current.notice).toBe('Чернетку видалено.');
  });

  it('clears the error when the discard dialog is cancelled', async () => {
    const { result } = setup({ discardDraft: vi.fn(() => Promise.reject(new Error('Ні'))) });
    act(() => result.current.discard.start());
    await act(() => result.current.discard.confirm());
    expect(result.current.discard.error).toBe('Ні');
    act(() => result.current.discard.cancel());
    expect(result.current.discard.error).toBeUndefined();
    expect(result.current.discard.open).toBe(false);
  });
});
