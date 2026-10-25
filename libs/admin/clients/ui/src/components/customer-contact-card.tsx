import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';

export function CustomerContactCard({
  email,
  phone,
}: {
  email: string | null;
  phone: string | null;
}) {
  return (
    <SectionCard title="Контактні дані">
      <DetailFieldList>
        <DetailField label="Телефон" value={phone || 'Не вказано'} />
        <DetailField label="Email" value={email || 'Не вказано'} />
      </DetailFieldList>
    </SectionCard>
  );
}
