import { isLegalDocumentKind, legalDocumentKinds, versionToDraft } from '@admin/documents/model';
import {
  DiscardDraftDialog,
  LegalDocumentActions,
  LegalDocumentForm,
  PublishLegalDocumentDialog,
} from '@admin/documents/ui';
import { AdminDetailHeader, NoticeSnackbar, PageLoader, SectionCard } from '@admin/shared/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { LegalDocumentStatus } from '../components/legal-document-status';
import { LegalDocumentVersions } from '../components/legal-document-versions';
import { useLegalDocumentEditor } from '../hooks/use-legal-document-editor';
import { useLegalDocumentPublishing } from '../hooks/use-legal-document-publishing';

import type { LegalDocumentKind } from '@admin/documents/model';

const today = () => new Date().toLocaleDateString('sv-SE');

function LegalDocumentEditor({ kind }: { kind: LegalDocumentKind }) {
  const info = legalDocumentKinds[kind];
  const editor = useLegalDocumentEditor(kind);
  const { discard, notice, publish, setNotice } = useLegalDocumentPublishing(editor);

  if (editor.loading) return <PageLoader label="Завантаження документа" />;
  if (editor.loadError || !editor.draft || !editor.overview)
    return (
      <Alert action={<Button onClick={editor.refetch}>Повторити</Button>} severity="error">
        Не вдалося завантажити документ. Спробуйте ще раз.
      </Alert>
    );

  return (
    <>
      <LegalDocumentStatus overview={editor.overview} />
      <SectionCard title="Текст">
        <LegalDocumentForm draft={editor.draft} errors={editor.errors} onChange={editor.change} />
      </SectionCard>
      {editor.saveError ? <Alert severity="error">{editor.saveError}</Alert> : null}
      <LegalDocumentActions
        dirty={editor.dirty}
        discarding={editor.discarding}
        hasDraft={editor.hasDraft}
        onDiscard={discard.start}
        onPublish={publish.start}
        onReset={editor.reset}
        onSave={() =>
          void editor
            .saveDraft()
            .then((saved) => saved && setNotice('Чернетку збережено. На сайті поки старий текст.'))
        }
        publishing={editor.publishing}
        saving={editor.saving}
      />
      <LegalDocumentVersions
        kind={kind}
        onCopy={(version) => {
          editor.change(versionToDraft(version));
          setNotice(`Текст редакції №${version.number} у формі. Збережіть або опублікуйте його.`);
        }}
        showsEditionDate={info.showsEditionDate}
      />
      <PublishLegalDocumentDialog
        asksEditionDate={info.showsEditionDate}
        error={publish.error}
        key={publish.round}
        onCancel={publish.cancel}
        onConfirm={(date) => void publish.confirm(date)}
        open={publish.open}
        publishedFrom={editor.overview.published?.effectiveFrom ?? null}
        publishing={editor.publishing}
        title={info.label}
        today={today()}
      />
      <DiscardDraftDialog
        deleting={editor.discarding}
        error={discard.error}
        onCancel={discard.cancel}
        onConfirm={() => void discard.confirm()}
        open={discard.open}
      />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </>
  );
}

/** One document: edit both languages, publish with «Редакція від», look through old editions. */
export function LegalDocumentEditorPage() {
  const { kind } = useParams();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [kind]);

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        backLabel="Назад до документів"
        backTo="/documents"
        headingRef={headingRef}
        title={isLegalDocumentKind(kind) ? legalDocumentKinds[kind].label : 'Документ'}
      />
      {isLegalDocumentKind(kind) ? (
        <LegalDocumentEditor key={kind} kind={kind} />
      ) : (
        <Alert severity="info">Такого документа немає.</Alert>
      )}
    </Stack>
  );
}

export default LegalDocumentEditorPage;
