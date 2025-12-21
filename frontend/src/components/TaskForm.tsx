import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskCreateInput, TaskUpdateInput, Priority, Status, Task } from "../types/task";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 chars"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
  assignedToId: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Task>;
  onSubmit: (payload: TaskCreateInput | TaskUpdateInput) => Promise<void> | void;
  submitLabel?: string;
}

export default function TaskForm({ defaultValues, onSubmit, submitLabel = "Save Task" }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      dueDate: defaultValues?.dueDate ? defaultValues.dueDate.slice(0, 10) : "",
      priority: (defaultValues?.priority as Priority) ?? "MEDIUM",
      status: (defaultValues?.status as Status) ?? "TODO",
      assignedToId: defaultValues?.assignedToId ?? ""
    }
  });

  const onSubmitInternal = async (data: FormData) => {
    await onSubmit({
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate).toISOString(),
      priority: data.priority.toUpperCase() as Priority,
      status: data.status.toUpperCase().replace(" ","_") as Status,
      assignedToId: data.assignedToId || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInternal)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block font-medium">Title</label>
        <input {...register("title")} className="w-full border rounded px-3 py-2" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea {...register("description")} className="w-full border rounded px-3 py-2 min-h-[120px]" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Due date</label>
          <input type="date" {...register("dueDate")} className="w-full border rounded px-3 py-2" />
          {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Priority</label>
          <select {...register("priority")} className="w-full border rounded px-3 py-2">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
           <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select {...register("status")} className="w-full border rounded px-3 py-2">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>


      <div>
        <label className="block font-medium">Assigned To (User ID)</label>
        <input {...register("assignedToId")} className="w-full border rounded px-3 py-2" placeholder="Optional user ID" />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}