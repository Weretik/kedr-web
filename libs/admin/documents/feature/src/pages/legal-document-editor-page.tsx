import {
  useGetLegalDocumentVersionQuery,
  useGetLegalDocumentVersionsQuery,
} from '@admin/documents/data-access';
import { isLegalDocumentKind, legalDocumentKinds, versionToDraft } from '@admin/documents/model';
import {
  DiscardDraftDialog,
  LegalDocumentActions,
  LegalDocumentForm,
  LegalDocumentHistory,
  LegalDocumentVersionDialog,
  PublishLegalDocumentDialog,
  legalDocumentSiteState,
} from '@admin/documents/ui';
import {
  AdminDetailHeader,
  ChangedNote,
  NoticeSnackbar,
  PageLoader,
  SectionCard,
} from '@admin/shared/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useLegalDocumentEditor } from '../hooks/use-legal-document-editor';

import type { LegalDocumentKind } from '@admin/documents/model';

const today = () => new Date().toLocaleDateString('sv-SE');

function LegalDocumentEditor({ kind }: { kind: LegalDocumentKind }) {
  const info = legalDocumentKinds[kind];
  const editor = useLegalDocumentEditor(kind);
  const history = useGetLegalDocumentVersionsQuery(kind);
  const [notice, setNotice] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  /** Bumped on every open so the dialog starts from the default date again. */
  const [publishRound, setPublishRound] = useState(0);
  const [publishError, setPublishError] = useState<string | undefined>();
  const [discardOpen, setDiscardOpen] = useState(false);
  const [discardError, setDiscardError] = useState<string | undefined>();
  const [viewId, setViewId] = useState<number | undefined>();
  const viewed = useGetLegalDocumentVersionQuery(viewId ?? 0, { skip: viewId === undefined });

  if (editor.loading) return <PageLoader label="Завантаження документа" />;
  if (editor.loadError || !editor.draft || !editor.overview)
    return (
      <Alert action={<Button onClick={editor.refetch}>Повторити</Button>} severity="error">
        Не вдалося завантажити документ. Спробуйте ще раз.
      </Alert>
    );

  const draftInfo = editor.overview.draft;
  const published = editor.overview.published;
  const confirmPublish = async (effectiveFrom: string) => {
    setPublishError(undefined);
    try {
      await editor.publishDraft(effectiveFrom);
      setPublishOpen(false);
      setNotice('Опубліковано. На сайті зміни з’являться протягом 10 хвилин.');
    } catch (error) {
      setPublishError((error as Error).message);
    }
  };
  const confirmDiscard = async () => {
    setDiscardError(undefined);
    try {
      await editor.discardDraft();
      setDiscardOpen(false);
      setNotice('Чернетку видалено.');
    } catch (error) {
      setDiscardError((error as Error).message);
    }
  };

  return (
    <>
      <Stack spacing={0.5}>
        <Typography variant="body2">{legalDocumentSiteState(editor.overview)}</Typography>
        {published?.publishedAt ? (
          <ChangedNote at={published.publishedAt} by={published.publishedBy} label="Опубліковано" />
        ) : null}
        <Typography color={draftInfo ? 'warning.main' : 'text.secondary'} variant="body2">
          {draftInfo
            ? `Є неопублікована чернетка: збережено ${new Date(draftInfo.updatedAt).toLocaleString('uk-UA')}, ${draftInfo.updatedBy}. Відвідувачі бачать текст, що на сайті.`
            : 'Нижче — текст, що на сайті. Змініть його і натисніть «Опублікувати».'}
        </Typography>
      </Stack>
      <SectionCard title="Текст">
        <LegalDocumentForm draft={editor.draft} errors={editor.errors} onChange={editor.change} />
      </SectionCard>
      {editor.saveError ? <Alert severity="error">{editor.saveError}</Alert> : null}
      <LegalDocumentActions
        dirty={editor.dirty}
        discarding={editor.discarding}
        hasDraft={editor.hasDraft}
        onDiscard={() => setDiscardOpen(true)}
        onPublish={() => {
          setPublishRound((round) => round + 1);
          setPublishOpen(true);
        }}
        onReset={editor.reset}
        onSave={() =>
          void editor
            .saveDraft()
            .then((saved) => saved && setNotice('Чернетку збережено. На сайті поки старий текст.'))
        }
        publishing={editor.publishing}
        saving={editor.saving}
      />
      {history.data ? (
        <LegalDocumentHistory
          onOpen={setViewId}
          showsEditionDate={info.showsEditionDate}
          versions={history.data}
        />
      ) : null}
      <PublishLegalDocumentDialog
        asksEditionDate={info.showsEditionDate}
        error={publishError}
        onCancel={() => {
          setPublishOpen(false);
          setPublishError(undefined);
        }}
        onConfirm={(date) => void confirmPublish(date)}
        key={publishRound}
        open={publishOpen}
        publishedFrom={editor.overview.published?.effectiveFrom ?? null}
        publishing={editor.publishing}
        title={info.label}
        today={today()}
      />
      <DiscardDraftDialog
        deleting={editor.discarding}
        error={discardError}
        onCancel={() => {
          setDiscardOpen(false);
          setDiscardError(undefined);
        }}
        onConfirm={() => void confirmDiscard()}
        open={discardOpen}
      />
      <LegalDocumentVersionDialog
        loading={viewId !== undefined && !viewed.data}
        onClose={() => setViewId(undefined)}
        onCopy={(version) => {
          editor.change(versionToDraft(version));
          setViewId(undefined);
          setNotice(`Текст редакції №${version.number} у формі. Збережіть або опублікуйте його.`);
        }}
        version={viewId !== undefined && viewed.data?.id === viewId ? viewed.data : undefined}
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
