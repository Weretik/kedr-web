import { DetailField, DetailFieldList, SectionCard, StatusPill } from '@admin/shared/ui';
import { canChangeOwnCredentials, staffRoleLabels } from '@admin/users/model';
import { Button, Stack } from '@mui/material';

import type { StaffProfile } from '@admin/users/model';
import type { ReactNode } from 'react';

export type ProfileField = 'name' | 'email' | 'password';

interface ProfileDetailsCardProps {
  profile: StaffProfile;
  onEdit: (field: ProfileField) => void;
}

function EditableRow({ children, onEdit }: { children: ReactNode; onEdit?: () => void }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      {children}
      {onEdit ? (
        <Button onClick={onEdit} size="small">
          Змінити
        </Button>
      ) : null}
    </Stack>
  );
}

/** Name, email, role and password; a manager edits only the name, an admin everything. */
export function ProfileDetailsCard({ onEdit, profile }: ProfileDetailsCardProps) {
  const canEditCredentials = canChangeOwnCredentials(profile);

  return (
    <SectionCard title="Особисті дані">
      <DetailFieldList>
        <EditableRow onEdit={() => onEdit('name')}>
          <DetailField label="Імʼя" value={profile.fullName || '—'} />
        </EditableRow>
        <EditableRow onEdit={canEditCredentials ? () => onEdit('email') : undefined}>
          <DetailField label="Email (логін)" value={profile.email} />
        </EditableRow>
        <DetailField
          label="Роль"
          value={
            <StatusPill
              label={staffRoleLabels[profile.role]}
              tone={profile.role === 'Admin' ? 'info' : 'success'}
            />
          }
        />
        {canEditCredentials ? (
          <EditableRow onEdit={() => onEdit('password')}>
            <DetailField label="Пароль" value="••••••••" />
          </EditableRow>
        ) : null}
      </DetailFieldList>
    </SectionCard>
  );
}
