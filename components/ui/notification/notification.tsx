// components/Notification.tsx
import React from "react";
import { useNotificationContext } from "./notification.context";
import { NotificationItem } from "./notification.type";
import { X } from "lucide-react";

const getNotificationStyles = (type: NotificationItem["type"]) => {
  const baseStyles =
    "max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
  switch (type) {
    case "success":
      return `${baseStyles} bg-green-400`;
    case "error":
      return `${baseStyles} bg-red-400`;
    case "warn":
      return `${baseStyles} bg-yellow-400`;
    case "info":
    default:
      return `${baseStyles} bg-blue-400`;
  }
};

const NotificationItemComponent: React.FC<{
  notification: NotificationItem;
}> = ({ notification }) => {
  const { removeNotification } = useNotificationContext();

  const handleClose = () => {
    removeNotification(notification.id);
  };

  return (
    <div className={getNotificationStyles(notification.type)}>
      <div className="p-4">
        <div className="flex items-center">
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-white">
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="text-white w-4 h-4 hover:text-opacity-50 transition-colors duration-200"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="w-full h-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotificationContext();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 top-0 flex flex-col items-center space-y-2 z-50"
      style={{ top: "100px" }}
      aria-live="assertive"
    >
      {notifications.map((notification) => (
        <NotificationItemComponent
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
};
