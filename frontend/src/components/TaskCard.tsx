import { Task } from "../types/task";
import { Link } from "react-router-dom";
import clsx from "clsx";

const priorityClass = (p: Task["priority"]) =>
  clsx("px-2 py-1 rounded text-xs font-medium", {
    "bg-green-100 text-green-700": p === "LOW",
    "bg-yellow-100 text-yellow-700": p === "MEDIUM",
    "bg-orange-100 text-orange-700": p === "HIGH",
    "bg-red-500 text-white": p === "URGENT",
  });

export default function TaskCard({ task }: { task: Task }) {
  const overdue =
    new Date(task.dueDate).getTime() < Date.now() &&
    task.status !== "COMPLETED";

  return (
    <div
      key={task.id}
      className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span className={priorityClass(task.priority)}>{task.priority}</span>
      </div>

      <p className="text-gray-600 line-clamp-3">
        {task.description || "No description provided"}
      </p>

      <div className="text-sm text-gray-500">
        Due: {new Date(task.dueDate).toLocaleDateString()}{" "}
        {new Date(task.dueDate).toLocaleTimeString()}
        {overdue && (
          <span className="ml-2 text-red-600 font-medium">Overdue</span>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          to={`/tasks/${task.id}`}
          aria-label={`View details for task ${task.title}`}
          className="text-blue-600 hover:underline text-sm"
        >
          View details
        </Link>
      </div>
    </div>
  );
}