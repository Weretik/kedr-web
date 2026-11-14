import { useState } from 'react';

interface PublishingActions {
  publishDraft: (effectiveFrom: string) => Promise<unknown>;
  discardDraft: () => Promise<unknown>;
}

interface ConfirmDialog {
  open: boolean;
  error: string | undefined;
}

const closed: ConfirmDialog = { open: false, error: undefined };

/** The «Опублікувати» and «Видалити чернетку» dialogs and the notice after each. */
export function useLegalDocumentPublishing({ publishDraft, discardDraft }: PublishingActions) {
  const [notice, setNotice] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(closed);
  /** Bumped on every open so the dialog starts from the default date again. */
  const [round, setRound] = useState(0);
  const [discarding, setDiscarding] = useState(closed);

  const confirm = async (
    action: () => Promise<unknown>,
    set: (dialog: ConfirmDialog) => void,
    done: string,
  ) => {
    set({ open: true, error: undefined });
    try {
      await action();
      set(closed);
      setNotice(done);
    } catch (error) {
      set({ open: true, error: (error as Error).message });
    }
  };

  return {
    notice,
    setNotice,
    publish: {
      ...publishing,
      round,
      start: () => {
        setRound((current) => current + 1);
        setPublishing({ open: true, error: undefined });
      },
      cancel: () => setPublishing(closed),
      confirm: (effectiveFrom: string) =>
        confirm(
          () => publishDraft(effectiveFrom),
          setPublishing,
          'Опубліковано. На сайті зміни з’являться протягом 10 хвилин.',
        ),
    },
    discard: {
      ...discarding,
      start: () => setDiscarding({ open: true, error: undefined }),
      cancel: () => setDiscarding(closed),
      confirm: () => confirm(discardDraft, setDiscarding, 'Чернетку видалено.'),
    },
  };
}
