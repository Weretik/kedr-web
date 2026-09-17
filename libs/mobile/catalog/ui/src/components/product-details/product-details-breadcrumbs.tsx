import { type CatalogProductDetails } from '@mobile/catalog/model';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

export function ProductDetailsBreadcrumbs({
  breadcrumbs,
}: Readonly<Pick<CatalogProductDetails, 'breadcrumbs'>>) {
  const theme = useTheme();

  return (
    <Surface elevation={0} style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium">Шлях у каталозі</Text>
      {breadcrumbs.length ? (
        breadcrumbs.map((breadcrumb) => (
          <Text key={breadcrumb.id} variant="bodyMedium">
            {breadcrumb.name} · {breadcrumb.slug} · ID: {breadcrumb.id}
          </Text>
        ))
      ) : (
        <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
          Шлях не вказано
        </Text>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({ section: { borderRadius: 16, gap: 12, padding: 16 } });
