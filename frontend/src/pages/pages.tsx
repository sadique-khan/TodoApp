import { useTasks } from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useCreateTask } from "../hooks/useTasks";
import { useEffect, useMemo, useState } from "react";
import { socket } from "../utils/socket";
import { Task } from "../types/task";
export default function DashboardPage() {
  const { data: tasks, isLoading } = useTasks();
  const { mutateAsync: createTask } = useCreateTask();

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [sortByDue, setSortByDue] = useState<boolean>(false);

  useEffect(() => {
    socket.emit("join", { room: "tasks" });

    socket.on("task:updated", () => {
      // React Query invalidation happens elsewhere; could dispatch an event or refetch here
      // Kept light to avoid double refetch
    });

    return () => {
      socket.emit("leave", { room: "tasks" });
      socket.off("task:updated");
    };
  }, []);

  const filtered = useMemo(() => {
    let list = tasks || [];
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter) list = list.filter((t) => t.priority === priorityFilter);
    if (sortByDue) list = [...list].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return list;
  }, [tasks, statusFilter, priorityFilter, sortByDue]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select className="border rounded px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option>TODO</option>
              <option>IN_PROGRESS</option>
              <option>REVIEW</option>
              <option>COMPLETED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select className="border rounded px-3 py-2" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All</option>
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>URGENT</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input id="sort" type="checkbox" checked={sortByDue} onChange={(e) => setSortByDue(e.target.checked)} />
            <label htmlFor="sort" className="text-sm">Sort by due date</label>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse h-24 rounded bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((task: Task) => <TaskCard key={task.id} task={task} />)}
            {filtered.length === 0 && <p className="text-gray-600">No tasks found.</p>}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Create task</h2>
        <TaskForm
          submitLabel="Create"
          onSubmit={async (payload) => {
            await createTask(payload);
          }}
        />
      </div>
    </div>
  );
}