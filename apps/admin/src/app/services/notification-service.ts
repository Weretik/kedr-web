export interface ErrorNotification {
  message: string;
  traceId?: string;
}

type ErrorNotificationListener = (notification: ErrorNotification) => void;

let listener: ErrorNotificationListener | undefined;

export const subscribeToErrorNotifications = (nextListener: ErrorNotificationListener) => {
  listener = nextListener;

  return () => {
    if (listener === nextListener) {
      listener = undefined;
    }
  };
};

export const showErrorNotification = (notification: ErrorNotification) => {
  listener?.(notification);
};
