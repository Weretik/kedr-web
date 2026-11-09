import { LineEditor } from '@mobile/calculation/ui';
import { useSelectedCustomer } from '@mobile/customers/data-access';
import { useEffect, useEffectEvent } from 'react';
import { ScrollView } from 'react-native';

import { useCalculationController } from '../hooks/use-calculation-controller';

export interface CalculationLineSheetProps {
  productId: number;
  /** Closes the sheet: after «Готово», after removing the line, or when the line is gone. */
  onClose: () => void;
}

/** One line of the chosen customer's calculation in a sheet: quantity, price per piece and removal (R-009). */
export function CalculationLineSheet({ onClose, productId }: Readonly<CalculationLineSheetProps>) {
  const customer = useSelectedCustomer();
  if (!customer) return <Closed onClose={onClose} />;
  return (
    <LineSheet
      counterpartyId={customer.counterpartyId}
      customerName={customer.name}
      onClose={onClose}
      productId={productId}
    />
  );
}

function LineSheet({
  counterpartyId,
  customerName,
  onClose,
  productId,
}: Readonly<CalculationLineSheetProps & { counterpartyId: string; customerName: string }>) {
  const controller = useCalculationController(counterpartyId, customerName);
  const line = controller.lines.find((candidate) => candidate.productId === productId);
  if (!line) return <Closed onClose={onClose} />;

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <LineEditor
        key={line.productId}
        line={line}
        onChangeAdjustment={(kopecks) => controller.setAdjustment(productId, kopecks)}
        onChangeQuantity={(quantity) => controller.setQuantity(productId, quantity)}
        onDone={onClose}
        // The line disappears and the sheet closes itself below.
        onRemove={() => controller.remove(productId)}
      />
    </ScrollView>
  );
}

/** A line removed elsewhere (or no customer) leaves nothing to edit: the sheet closes itself. */
function Closed({ onClose }: Readonly<{ onClose: () => void }>) {
  const close = useEffectEvent(onClose);
  // Once per mount, so a parent render cannot close the screen under the sheet as well.
  useEffect(() => close(), []);
  return null;
}
