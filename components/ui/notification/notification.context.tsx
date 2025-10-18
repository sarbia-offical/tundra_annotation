// contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  NotificationItem,
  NotificationType,
  NotificationContextType,
} from "./notification.type";
import { makeid } from "@/lib/utils";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
  config?: {
    maxCount?: number;
    duration?: number;
  };
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  config = {},
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const { maxCount = 3, duration: defaultDuration = 3000 } = config;

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "info", duration?: number) => {
      const id = makeid();
      const notificationDuration = duration ?? defaultDuration;

      const newNotification: NotificationItem = {
        id,
        type,
        message,
        duration: notificationDuration,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        return updated.slice(0, maxCount);
      });

      // 自动移除通知
      if (notificationDuration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, notificationDuration);
      }
    },
    [defaultDuration, maxCount, removeNotification]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};
