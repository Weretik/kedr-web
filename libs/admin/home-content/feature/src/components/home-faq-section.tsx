import { HomeFaqDialog, HomeFaqList, RemoveHomeItemDialog } from '@admin/home-content/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useFaqActions } from '../hooks/use-faq-actions';

import type { HomeFaqItem } from '@admin/home-content/model';

type Dialog =
  | { kind: 'none' }
  | { kind: 'edit'; item: HomeFaqItem | null }
  | { kind: 'remove'; item: HomeFaqItem };

interface HomeFaqSectionProps {
  items: readonly HomeFaqItem[];
  loading: boolean;
  onNotice: (message: string) => void;
}

/** «Часті запитання» of the home page: the list with its dialogs. */
export function HomeFaqSection({ items, loading, onNotice }: HomeFaqSectionProps) {
  const actions = useFaqActions(onNotice);
  const [dialog, setDialog] = useState<Dialog>({ kind: 'none' });
  const [error, setError] = useState<string | undefined>();

  const open = (next: Dialog) => {
    setError(undefined);
    setDialog(next);
  };
  const close = () => open({ kind: 'none' });
  const finish = (failure: string | undefined) => (failure ? setError(failure) : close());

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Typography color="text.secondary" variant="body2">
          Питання з відповідями українською та російською. Перше питання на сайті відкрите.
        </Typography>
        <Button
          onClick={() => open({ kind: 'edit', item: null })}
          startIcon={<AddIcon />}
          sx={{ flexShrink: 0 }}
          variant="contained"
        >
          Додати питання
        </Button>
      </Stack>
      {actions.orderError ? (
        <Alert onClose={actions.clearOrderError} severity="error">
          {actions.orderError}
        </Alert>
      ) : null}
      <HomeFaqList
        items={items}
        loading={loading}
        onAdd={() => open({ kind: 'edit', item: null })}
        onEdit={(item) => open({ kind: 'edit', item })}
        onMove={(item, to) => void actions.move(items, item, to)}
        onRemove={(item) => open({ kind: 'remove', item })}
        reordering={actions.reordering}
      />
      {dialog.kind === 'edit' ? (
        <HomeFaqDialog
          error={error}
          initial={dialog.item?.texts}
          key={dialog.item?.id ?? 'new'}
          onCancel={close}
          onSave={(texts) => void actions.save(dialog.item?.id ?? null, texts).then(finish)}
          saving={actions.saving}
        />
      ) : null}
      <RemoveHomeItemDialog
        error={dialog.kind === 'remove' ? error : undefined}
        onCancel={close}
        onConfirm={() => {
          if (dialog.kind === 'remove') void actions.remove(dialog.item).then(finish);
        }}
        open={dialog.kind === 'remove'}
        removing={actions.removing}
        text={
          dialog.kind === 'remove'
            ? `«${dialog.item.texts.questionUk}» зникне з головної разом із перекладом.`
            : ''
        }
        title="Видалити питання?"
      />
    </Stack>
  );
}
