import { useSocketNotifications } from "../utils/socket";
import clsx from "clsx";

export default function NotificationPanel() {
  const { notifications, clearNotifications } = useSocketNotifications();

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-sm text-red-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {[...notifications].reverse().map((n, i) => (
            <li
              key={n.id || i}
              className={clsx(
                "p-2 rounded border text-sm",
                n.type === "TASK_CREATED" && "bg-green-50 border-green-200",
                n.type === "TASK_UPDATED" && "bg-blue-50 border-blue-200",
                n.type === "TASK_DELETED" && "bg-red-50 border-red-200",
                n.type === "TASK_ASSIGNED" && "bg-yellow-50 border-yellow-200",
                n.type === "welcome" && "bg-gray-50 border-gray-200"
              )}
            >
              <span className="font-medium">{n.type}</span>: {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}