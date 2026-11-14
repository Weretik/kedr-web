import { canManageUsers, useAdminSession } from '@admin/core/auth';
import { useGetStaffAccountsQuery } from '@admin/users/data-access';
import { staffRoleLabels } from '@admin/users/model';
import { useMemo } from 'react';

import type { WorkAssignees } from '@admin/work/feature';
import type { WorkPerson } from '@admin/work/model';

/** People for «Звіт роботи» and «Для кого»: the staff list the admin manages on «Користувачі». */
export function useStaffMembers(skip = false): { staff: readonly WorkPerson[]; loading: boolean } {
  const { data, isLoading } = useGetStaffAccountsQuery(undefined, { skip });
  const staff = useMemo(
    () =>
      (data ?? []).map((account) => ({
        id: account.id,
        name: account.fullName || account.email,
        roleLabel: staffRoleLabels[account.role],
      })),
    [data],
  );
  return { staff, loading: isLoading };
}

/** An administrator may give a new task to anyone on «Мої задачі»; others only to themselves. */
export function useWorkAssignees(): WorkAssignees | null {
  const session = useAdminSession();
  const admin = session.status === 'authenticated' && canManageUsers(session.user);
  const { staff } = useStaffMembers(!admin);
  if (session.status !== 'authenticated' || !admin) return null;
  const selfId = session.user.id;
  return staff.some((person) => person.id === selfId) ? { people: staff, selfId } : null;
}
