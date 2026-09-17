import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { CartActionSheet } from './cart-action-sheet';
import { formatMoney } from './format-money';

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
  return (
    <CartActionSheet
      onDismiss={props.onDismiss}
      title="Оформлення замовлення"
      visible={props.visible}
    >
      <View style={styles.content}>
        <View style={styles.field}>
          <Text variant="labelLarge">Клієнт *</Text>
          <Button
            accessibilityLabel="Вибрати клієнта"
            mode="outlined"
            onPress={props.onOpenCustomerSelector}
          >
            {props.selectedCustomerName ?? 'Вибрати клієнта зі списку'}
          </Button>
          {props.customerError ? (
            <Text accessibilityRole="alert">{props.customerError}</Text>
          ) : null}
        </View>
        <View style={styles.field}>
          <Text variant="labelLarge">Коментар до замовлення</Text>
          <TextInput
            accessibilityLabel="Коментар до замовлення"
            error={Boolean(props.commentError)}
            label="Коментар (необов’язково)"
            maxLength={1000}
            multiline
            onChangeText={props.onCommentChange}
            placeholder="Додаткова інформація для замовлення"
            value={props.comment}
          />
          <Text>{props.comment.length}/1000</Text>
          {props.commentError ? <Text accessibilityRole="alert">{props.commentError}</Text> : null}
        </View>
        <View style={styles.orderSummary}>
          <Text variant="labelLarge">Склад замовлення</Text>
          <Text>
            {props.lineCount} товарних позицій · {formatMoney(props.total)}
          </Text>
          <Text variant="bodySmall">
            Товари, кількість і суми передаються автоматично з кошика.
          </Text>
        </View>
        {props.errorMessage ? <Text accessibilityRole="alert">{props.errorMessage}</Text> : null}
        <Button
          accessibilityLabel="Підтвердити замовлення"
          disabled={props.submitting}
          loading={props.submitting}
          mode="contained"
          onPress={props.onSubmit}
        >
          {props.submitting ? 'Надсилаємо…' : 'Підтвердити замовлення'}
        </Button>
      </View>
    </CartActionSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 20, paddingBottom: 32 },
  field: { gap: 8 },
  orderSummary: { gap: 4 },
});
