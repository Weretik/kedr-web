import { homeBrandDraftFrom } from '@admin/home-content/model';
import { HomeBrandGrid, HomeBrandPanel, RemoveHomeItemDialog } from '@admin/home-content/ui';
import { mediaAcceptedTypes } from '@admin/media/model';
import { MediaPickerDialog } from '@admin/media/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useBrandActions } from '../hooks/use-brand-actions';
import { useLogoPicker } from '../hooks/use-logo-picker';

import type { HomeBrand } from '@admin/home-content/model';

type Dialog =
  | { kind: 'none' }
  | { kind: 'edit'; brand: HomeBrand | null }
  | { kind: 'remove'; brand: HomeBrand };

interface HomeBrandsSectionProps {
  brands: readonly HomeBrand[];
  loading: boolean;
  onNotice: (message: string) => void;
}

const accept = mediaAcceptedTypes.join(',');

/** «Бренди, з якими працюємо» of the home page: logos from the media library with their dialogs. */
export function HomeBrandsSection({ brands, loading, onNotice }: HomeBrandsSectionProps) {
  const actions = useBrandActions(onNotice);
  const logo = useLogoPicker();
  const [dialog, setDialog] = useState<Dialog>({ kind: 'none' });
  const [error, setError] = useState<string | undefined>();

  const open = (next: Dialog) => {
    setError(undefined);
    logo.reset();
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
          Логотипи беруться з медіатеки. Порядок тут такий самий, як у ряду на сайті.
        </Typography>
        <Button
          onClick={() => open({ kind: 'edit', brand: null })}
          startIcon={<AddIcon />}
          sx={{ flexShrink: 0 }}
          variant="contained"
        >
          Додати бренд
        </Button>
      </Stack>
      {actions.orderError ? (
        <Alert onClose={actions.clearOrderError} severity="error">
          {actions.orderError}
        </Alert>
      ) : null}
      <HomeBrandGrid
        brands={brands}
        loading={loading}
        onAdd={() => open({ kind: 'edit', brand: null })}
        onEdit={(brand) => open({ kind: 'edit', brand })}
        onMove={(brand, to) => void actions.move(brands, brand, to)}
        onRemove={(brand) => open({ kind: 'remove', brand })}
        reordering={actions.reordering}
      />
      {dialog.kind === 'edit' ? (
        <HomeBrandPanel
          accept={accept}
          error={logo.issue ?? error}
          initial={dialog.brand ? homeBrandDraftFrom(dialog.brand) : undefined}
          key={dialog.brand?.id ?? 'new'}
          onCancel={close}
          onPickFromLibrary={logo.dialog.onOpen}
          onSave={(draft) => void actions.save(dialog.brand?.id ?? null, draft).then(finish)}
          onUpload={(file) => void logo.upload(file)}
          pickedLogo={logo.picked}
          saving={actions.saving}
          uploading={logo.uploading}
        />
      ) : null}
      <MediaPickerDialog
        error={logo.dialog.error}
        files={logo.dialog.files}
        loading={logo.dialog.loading}
        multiple={false}
        onCancel={logo.dialog.onCancel}
        onConfirm={logo.dialog.onConfirm}
        onPageChange={logo.dialog.onPageChange}
        onRetry={logo.dialog.onRetry}
        onSearchChange={logo.dialog.onSearchChange}
        open={logo.dialog.open}
        page={logo.dialog.page}
        pageCount={logo.dialog.pageCount}
        search={logo.dialog.search}
        title="Логотип з медіатеки"
      />
      <RemoveHomeItemDialog
        error={dialog.kind === 'remove' ? error : undefined}
        onCancel={close}
        onConfirm={() => {
          if (dialog.kind === 'remove') void actions.remove(dialog.brand).then(finish);
        }}
        open={dialog.kind === 'remove'}
        removing={actions.removing}
        text={
          dialog.kind === 'remove'
            ? `«${dialog.brand.name}» зникне з головної. Файл логотипа залишиться в медіатеці.`
            : ''
        }
        title="Прибрати бренд?"
      />
    </Stack>
  );
}
