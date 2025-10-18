export type NotificationType = "info" | "error" | "warn" | "success";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface NotificationConfig {
  maxCount?: number;
  duration?: number;
}

export interface NotificationContextType {
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  notifications: NotificationItem[];
}
