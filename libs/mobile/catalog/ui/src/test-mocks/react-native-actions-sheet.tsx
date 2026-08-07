import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react';
import { ScrollView as NativeScrollView, View, type ViewProps } from 'react-native';

type ActionSheetProps = ViewProps & { children?: ReactNode; containerStyle?: ViewProps['style']; indicatorStyle?: ViewProps['style']; onClose?: () => void };

const ActionSheet = forwardRef<unknown, ActionSheetProps>(function ActionSheet({ children, onClose, ...props }, ref) {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    hide: () => { setVisible(false); onClose?.(); },
    show: () => setVisible(true),
  }), [onClose]);

  return visible ? <View {...props}>{children}</View> : null;
});

export default ActionSheet;
export const ScrollView = NativeScrollView;
