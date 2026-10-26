import { type CatalogProductDetails } from '@mobile/catalog/model';
import { KedrCard, useKedrTheme } from '@mobile/shared/ui';
import { Text } from 'react-native-paper';

export function ProductDetailsBreadcrumbs({
  breadcrumbs,
}: Readonly<Pick<CatalogProductDetails, 'breadcrumbs'>>) {
  const { kedr } = useKedrTheme();

  return (
    <KedrCard title="Шлях у каталозі">
      {breadcrumbs.length ? (
        breadcrumbs.map((breadcrumb) => (
          <Text key={breadcrumb.id} style={{ color: kedr.colors.onSurface }} variant="bodyMedium">
            {breadcrumb.name} · {breadcrumb.slug} · ID: {breadcrumb.id}
          </Text>
        ))
      ) : (
        <Text style={{ color: kedr.colors.onSurfaceVariant }} variant="bodyMedium">
          Шлях не вказано
        </Text>
      )}
    </KedrCard>
  );
}
