import { canDeleteMedia, canEditCatalog, useAdminSession } from '@admin/core/auth';

/** Whether the signed-in user may change the catalog. */
export function useCanEditCatalog(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canEditCatalog(session.user);
}

/** Whether the signed-in user may delete media files. */
export function useCanDeleteMedia(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canDeleteMedia(session.user);
}

export function useSignedInUserName(): string | null {
  const session = useAdminSession();
  return session.status === 'authenticated' ? session.user.fullName : null;
}

export function useSignedInUserId(): string | null {
  const session = useAdminSession();
  return session.status === 'authenticated' ? session.user.id : null;
}
