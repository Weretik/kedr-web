import {
  useGetLegalDocumentVersionQuery,
  useGetLegalDocumentVersionsQuery,
} from '@admin/documents/data-access';
import { LegalDocumentHistory, LegalDocumentVersionDialog } from '@admin/documents/ui';
import { useState } from 'react';

import type { LegalDocumentKind, LegalDocumentVersion } from '@admin/documents/model';

interface LegalDocumentVersionsProps {
  kind: LegalDocumentKind;
  showsEditionDate: boolean;
  /** «Скопіювати у форму» on an old edition. */
  onCopy: (version: LegalDocumentVersion) => void;
}

/** Old editions of one document and the dialog that shows one of them. */
export function LegalDocumentVersions({
  kind,
  onCopy,
  showsEditionDate,
}: LegalDocumentVersionsProps) {
  const history = useGetLegalDocumentVersionsQuery(kind);
  const [viewId, setViewId] = useState<number | undefined>();
  const viewed = useGetLegalDocumentVersionQuery(viewId ?? 0, { skip: viewId === undefined });

  return (
    <>
      {history.data ? (
        <LegalDocumentHistory
          onOpen={setViewId}
          showsEditionDate={showsEditionDate}
          versions={history.data}
        />
      ) : null}
      <LegalDocumentVersionDialog
        loading={viewId !== undefined && !viewed.data}
        onClose={() => setViewId(undefined)}
        onCopy={(version) => {
          onCopy(version);
          setViewId(undefined);
        }}
        version={viewId !== undefined && viewed.data?.id === viewId ? viewed.data : undefined}
      />
    </>
  );
}
