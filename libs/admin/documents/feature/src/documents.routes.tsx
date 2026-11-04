import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const LegalDocumentsPage = lazy(() => import('./pages/legal-documents-page'));
const LegalDocumentEditorPage = lazy(() => import('./pages/legal-document-editor-page'));

/** Open to every staff role (Manager and Admin), as the backend policy CanManageContent. */
export const documentsRoutes: RouteObject[] = [
  { path: 'documents', element: <LegalDocumentsPage /> },
  { path: 'documents/:kind', element: <LegalDocumentEditorPage /> },
];
