// hooks/useNotification.ts
import { useNotificationContext } from "./notification.context";
import { NotificationType } from "./notification.type";

export const useNotification = () => {
  const { addNotification, removeNotification, notifications } =
    useNotificationContext();

  const notification = {
    info: (message: string, duration?: number) =>
      addNotification(message, "info", duration),
    success: (message: string, duration?: number) =>
      addNotification(message, "success", duration),
    warn: (message: string, duration?: number) =>
      addNotification(message, "warn", duration),
    error: (message: string, duration?: number) =>
      addNotification(message, "error", duration),
    remove: removeNotification,
    clearAll: () => {
      notifications.forEach((notif) => removeNotification(notif.id));
    },
  };

  return notification;
};
