import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

type ActionSheetProps = ViewProps & { children?: ReactNode; onClose?: () => void };

const ActionSheet = forwardRef<unknown, ActionSheetProps>(function ActionSheet({ children, onClose, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({ hide: () => { setVisible(false); onClose?.(); }, show: () => setVisible(true) }), [onClose]);
  return visible ? <View {...props}>{children}</View> : null;
});

export default ActionSheet;
