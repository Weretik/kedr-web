import { mediaAcceptedTypes } from '@admin/media/model';
import { MediaPickerDialog } from '@admin/media/ui';
import {
  useGetSeoSettingsQuery,
  useUpdateSeoSettingsMutation,
} from '@admin/seo-settings/data-access';
import { seoSettingsDraftFrom } from '@admin/seo-settings/model';
import { SeoSettingsPanel, SeoSettingsView } from '@admin/seo-settings/ui';
import { AdminPageHeader, ChangedNote, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { seoSettingsErrorMessage } from '../errors/seo-settings-error-message';
import { useSharePicture } from '../hooks/use-share-picture';

import type { SeoSettingsDraft } from '@admin/seo-settings/model';

const accept = mediaAcceptedTypes.join(',');

/** Analytics and verification codes for the public site, plus its link-preview picture. */
export function SeoSettingsPage() {
  const query = useGetSeoSettingsQuery();
  const [update, saving] = useUpdateSeoSettingsMutation();
  const picture = useSharePicture();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string | null>(null);
  const settings = query.data;

  const open = () => {
    if (!settings) return;
    setError(undefined);
    picture.reset(settings.sharePicture);
    setEditing(true);
  };

  const save = async (draft: SeoSettingsDraft) => {
    setError(undefined);
    try {
      await update(draft).unwrap();
      setEditing(false);
      setNotice('Збережено. Сайт покаже зміни протягом 10 хвилин.');
    } catch (cause) {
      setError(seoSettingsErrorMessage(cause));
    }
  };

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          settings ? (
            <Button onClick={open} startIcon={<EditOutlinedIcon />} variant="contained">
              Редагувати
            </Button>
          ) : null
        }
        title="Налаштування SEO сайту"
      />
      <Typography color="text.secondary" variant="body2">
        Коди аналітики та підтвердження сайту в Google і Bing, а також фото для поширення посилань.
        Підключення сервісів робить SEO-фахівець, тут лише вставляються його коди.
      </Typography>
      {query.isLoading ? (
        <PageLoader label="Завантаження налаштувань" />
      ) : query.isError || !settings ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити налаштування. Спробуйте ще раз.
        </Alert>
      ) : (
        <>
          {settings.updatedBy ? (
            <ChangedNote at={settings.updatedAt} by={settings.updatedBy} />
          ) : null}
          <SeoSettingsView settings={settings} />
        </>
      )}
      {editing && settings ? (
        <SeoSettingsPanel
          accept={accept}
          error={picture.issue ?? error}
          initial={seoSettingsDraftFrom(settings)}
          onCancel={() => setEditing(false)}
          onPickFromLibrary={picture.dialog.onOpen}
          onRemovePicture={picture.remove}
          onSave={(draft) => void save(draft)}
          onUpload={(file) => void picture.upload(file)}
          picture={picture.picture}
          saving={saving.isLoading}
          uploading={picture.uploading}
        />
      ) : null}
      <MediaPickerDialog
        error={picture.dialog.error}
        files={picture.dialog.files}
        loading={picture.dialog.loading}
        multiple={false}
        onCancel={picture.dialog.onCancel}
        onConfirm={picture.dialog.onConfirm}
        onPageChange={picture.dialog.onPageChange}
        onRetry={picture.dialog.onRetry}
        onSearchChange={picture.dialog.onSearchChange}
        open={picture.dialog.open}
        page={picture.dialog.page}
        pageCount={picture.dialog.pageCount}
        search={picture.dialog.search}
        title="Фото для поширення з медіатеки"
      />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SeoSettingsPage;
