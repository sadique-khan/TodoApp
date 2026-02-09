import { useNavigate, useParams } from "react-router-dom";
import { useTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import TaskForm from "../components/TaskForm";
import { useEffect } from "react";
import { socket } from "../utils/socket";

export default function TaskDetailPage() {
  const { id = "" } = useParams();
  const { data: task, isLoading } = useTask(id);
  const { mutateAsync: updateTask } = useUpdateTask(id);
  const { mutateAsync: deleteTask } = useDeleteTask();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    socket.emit("join", { room: `task:${id}` });

    socket.on("task:updated", () => {
      // Could trigger a refetch here if not handled globally
    });

    return () => {
      socket.emit("leave", { room: `task:${id}` });
      socket.off("task:updated");
    };
  }, [id]);

  if (isLoading || !task) return <p>Loading...</p>;

  return (
    <div className="grid gap-6">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold">{task.title}</h1>
        <p className="text-gray-600 mt-2">{task.description}</p>
        <div className="text-sm text-gray-500 mt-2">Due: {new Date(task.dueDate).toLocaleString()}</div>
        <div className="flex gap-2 mt-4">
          <button
            className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
            onClick={async () => {
              await deleteTask(task.id,{
                onSuccess:() =>{
                  navigate('/dashboard',{replace:true})
                }
              }

              );
              
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Edit task</h2>
        <TaskForm
          defaultValues={task}
          submitLabel="Update"
          onSubmit={async (payload) => {
            await updateTask(payload);
            socket.emit("task:update:client", { id }); // optional client signal
          }}
        />
      </div>
    </div>
  );
}