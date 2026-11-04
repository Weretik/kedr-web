import {
  useCreateLegalDocumentDraftMutation,
  useDeleteLegalDocumentDraftMutation,
  useGetLegalDocumentVersionQuery,
  useGetLegalDocumentsQuery,
  usePublishLegalDocumentDraftMutation,
  useUpdateLegalDocumentDraftMutation,
} from '@admin/documents/data-access';
import {
  isSameLegalDocumentDraft,
  validateLegalDocumentDraft,
  versionToDraft,
} from '@admin/documents/model';
import { useEffect, useMemo, useState } from 'react';

import { legalDocumentErrorMessage } from '../errors/legal-document-error-message';

import type {
  LegalDocumentDraft,
  LegalDocumentDraftErrors,
  LegalDocumentKind,
  LegalDocumentVersion,
} from '@admin/documents/model';

/**
 * Edits one document: the form starts from the waiting draft, or from the text on the site when there is
 * none. Saving creates the draft on first use; publishing saves unsaved changes first.
 */
export function useLegalDocumentEditor(kind: LegalDocumentKind) {
  const list = useGetLegalDocumentsQuery();
  const overview = list.data?.find((item) => item.kind === kind);
  const draftId = overview?.draft?.id;
  const currentId = draftId ?? overview?.published?.id;
  const version = useGetLegalDocumentVersionQuery(currentId ?? 0, {
    skip: currentId === undefined,
  });
  const [create, createState] = useCreateLegalDocumentDraftMutation();
  const [update, updateState] = useUpdateLegalDocumentDraftMutation();
  const [publish, publishState] = usePublishLegalDocumentDraftMutation();
  const [discard, discardState] = useDeleteLegalDocumentDraftMutation();

  const [edits, setEdits] = useState<LegalDocumentDraft | undefined>();
  const [errors, setErrors] = useState<LegalDocumentDraftErrors | undefined>();
  const [saveError, setSaveError] = useState<string | undefined>();

  const loaded = version.data?.id === currentId ? version.data : undefined;
  const baseline = useMemo(() => (loaded ? versionToDraft(loaded) : undefined), [loaded]);
  const draft = edits ?? baseline;
  const dirty = Boolean(edits && baseline && !isSameLegalDocumentDraft(edits, baseline));

  useEffect(() => {
    setEdits(undefined);
    setErrors(undefined);
    setSaveError(undefined);
  }, [kind]);

  const change = (next: LegalDocumentDraft) => {
    setEdits(next);
    if (errors) setErrors(validateLegalDocumentDraft(next));
  };

  const reset = () => {
    setEdits(undefined);
    setErrors(undefined);
    setSaveError(undefined);
  };

  /** Saves the form as the draft; the result carries the draft or the reason it was not saved. */
  const persist = async (): Promise<{ saved?: LegalDocumentVersion; problem?: string }> => {
    if (!draft) return { problem: 'Текст ще завантажується.' };
    const problems = validateLegalDocumentDraft(draft);
    setErrors(problems);
    if (problems) return { problem: 'Виправте помилки в тексті.' };

    setSaveError(undefined);
    try {
      const saved = draftId
        ? await update({ kind, id: draftId, draft }).unwrap()
        : await create({ kind, draft }).unwrap();
      setEdits(undefined);
      return { saved };
    } catch (error) {
      const problem = legalDocumentErrorMessage(error);
      setSaveError(problem);
      return { problem };
    }
  };

  const saveDraft = async () => Boolean((await persist()).saved);

  /** Publishes the draft (saving first when needed); throws the message for the dialog. */
  const publishDraft = async (effectiveFrom: string) => {
    const { saved, problem } = dirty || !draftId ? await persist() : { saved: loaded };
    const target = saved;
    if (!target) throw new Error(problem ?? 'Текст ще завантажується.');
    try {
      await publish({ kind, id: target.id, effectiveFrom }).unwrap();
    } catch (error) {
      throw new Error(legalDocumentErrorMessage(error));
    }
  };

  const discardDraft = async () => {
    if (!draftId) return;
    try {
      await discard({ kind, id: draftId }).unwrap();
      reset();
    } catch (error) {
      throw new Error(legalDocumentErrorMessage(error));
    }
  };

  return {
    change,
    dirty,
    discardDraft,
    discarding: discardState.isLoading,
    draft,
    errors,
    hasDraft: Boolean(draftId),
    loadError: list.isError || version.isError,
    loading: list.isLoading || (currentId !== undefined && !loaded),
    overview,
    publishDraft,
    publishing: publishState.isLoading || createState.isLoading || updateState.isLoading,
    refetch: () => {
      void list.refetch();
      if (currentId) void version.refetch();
    },
    replaceText: (next: LegalDocumentDraft) => change(next),
    reset,
    saveDraft,
    saveError,
    saving: createState.isLoading || updateState.isLoading,
    current: loaded,
  };
}
