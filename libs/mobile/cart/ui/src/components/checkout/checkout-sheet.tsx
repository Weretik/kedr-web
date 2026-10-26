import { tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Icon, Text, TextInput } from 'react-native-paper';

import { CartActionSheet } from './cart-action-sheet';
import { formatMoney } from '../../utils/format-money';

export interface CheckoutSheetProps {
  comment: string;
  commentError?: string;
  customerError?: string;
  errorMessage?: string | null;
  lineCount: number;
  onCommentChange: (value: string) => void;
  onDismiss: () => void;
  onOpenCustomerSelector: () => void;
  onSubmit: () => void;
  selectedCustomerName?: string;
  submitting: boolean;
  total: number;
  visible: boolean;
}

export function CheckoutSheet(props: Readonly<CheckoutSheetProps>) {
  const { kedr } = useKedrTheme();
  const errorColor = kedr.colors.status.error.foreground;

  return (
    <CartActionSheet
      onDismiss={props.onDismiss}
      title="Оформлення замовлення"
      visible={props.visible}
    >
      <View style={styles.content}>
        <View style={styles.field}>
          <Text variant="labelLarge">Клієнт *</Text>
          <Pressable
            accessibilityLabel="Вибрати клієнта"
            accessibilityRole="button"
            onPress={props.onOpenCustomerSelector}
            style={[
              styles.customer,
              {
                backgroundColor: props.selectedCustomerName
                  ? kedr.colors.inverseSurface
                  : kedr.colors.surfaceVariant,
                borderColor: props.customerError ? errorColor : 'transparent',
                borderRadius: kedr.radius.lg,
              },
            ]}
          >
            <Icon
              color={
                props.selectedCustomerName ? kedr.colors.inverseOnSurface : kedr.colors.primary
              }
              size={22}
              source="account-outline"
            />
            <Text
              numberOfLines={1}
              style={[
                styles.customerName,
                {
                  color: props.selectedCustomerName
                    ? kedr.colors.inverseOnSurface
                    : kedr.colors.onSurface,
                },
              ]}
              variant="labelLarge"
            >
              {props.selectedCustomerName ?? 'Вибрати клієнта зі списку'}
            </Text>
            <Icon
              color={
                props.selectedCustomerName
                  ? kedr.colors.inverseOnSurface
                  : kedr.colors.onSurfaceVariant
              }
              size={20}
              source="chevron-right"
            />
          </Pressable>
          {props.customerError ? (
            <Text accessibilityRole="alert" style={{ color: errorColor }} variant="labelSmall">
              {props.customerError}
            </Text>
          ) : null}
        </View>
        <View style={styles.field}>
          <Text variant="labelLarge">Коментар до замовлення</Text>
          <TextInput
            accessibilityLabel="Коментар до замовлення"
            error={Boolean(props.commentError)}
            activeOutlineColor={kedr.colors.primary}
            label="Коментар (необов’язково)"
            maxLength={1000}
            mode="outlined"
            multiline
            outlineStyle={{ borderRadius: kedr.radius.md }}
            onChangeText={props.onCommentChange}
            placeholder="Додаткова інформація для замовлення"
            value={props.comment}
          />
          <Text
            style={[styles.counter, tabularNumbers, { color: kedr.colors.onSurfaceVariant }]}
            variant="labelSmall"
          >
            {props.comment.length}/1000
          </Text>
          {props.commentError ? (
            <Text accessibilityRole="alert" style={{ color: errorColor }} variant="labelSmall">
              {props.commentError}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.orderSummary,
            { backgroundColor: kedr.colors.highlight, borderRadius: kedr.radius.lg },
          ]}
        >
          <Text variant="labelLarge">Склад замовлення</Text>
          <Text style={tabularNumbers}>
            {props.lineCount} товарних позицій · {formatMoney(props.total)}
          </Text>
          <Text style={{ color: kedr.colors.onSurfaceVariant }} variant="bodySmall">
            Товари, кількість і суми передаються автоматично з кошика.
          </Text>
        </View>
        {props.errorMessage ? (
          <Text accessibilityRole="alert" style={{ color: errorColor }}>
            {props.errorMessage}
          </Text>
        ) : null}
        <Button
          accessibilityLabel="Підтвердити замовлення"
          buttonColor={kedr.colors.primary}
          contentStyle={styles.submitContent}
          disabled={props.submitting}
          loading={props.submitting}
          mode="contained"
          onPress={props.onSubmit}
          style={styles.submit}
          textColor={kedr.colors.onPrimary}
        >
          {props.submitting ? 'Надсилаємо…' : 'Підтвердити замовлення'}
        </Button>
      </View>
    </CartActionSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 16, paddingBottom: 28 },
  counter: { textAlign: 'right' },
  customer: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 14,
  },
  customerName: { flex: 1 },
  field: { gap: 8 },
  orderSummary: { gap: 4, padding: 14 },
  submit: { borderRadius: 999 },
  submitContent: { minHeight: 52 },
});
