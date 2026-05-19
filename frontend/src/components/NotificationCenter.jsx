import { useEffect, useState } from 'react';
import { FiAlertCircle, FiBell, FiCheckCircle, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
    offNotification,
    onNotification,
    subscribeToNotifications,
} from '../../services/socketClient';

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      subscribeToNotifications(user.uid);

      const handleNotification = (notification) => {
        const id = Date.now();
        setNotifications((prev) => [
          { ...notification, id },
          ...prev,
        ]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
          removeNotification(id);
        }, 5000);
      };

      onNotification(handleNotification);

      return () => {
        offNotification(handleNotification);
      };
    }
  }, [user]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-600" />;
      case 'error':
        return <FiAlertCircle className="text-red-600" />;
      default:
        return <FiBell className="text-blue-600" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-fade-in ${getBackgroundColor(
              notif.type
            )}`}
          >
            {getIcon(notif.type)}
            <div className="flex-1">
              {notif.title && (
                <p className={`font-semibold ${getTextColor(notif.type)}`}>
                  {notif.title}
                </p>
              )}
              <p className={`text-sm ${getTextColor(notif.type)}`}>
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>

      {/* Notification Center Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Notifications"
      >
        <FiBell size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Center Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-y-auto z-40">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <FiBell className="mx-auto mb-2 text-gray-400" size={32} />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3"
                >
                  {getIcon(notif.type)}
                  <div className="flex-1">
                    {notif.title && (
                      <p className="font-semibold text-gray-900">
                        {notif.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notif.id)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
