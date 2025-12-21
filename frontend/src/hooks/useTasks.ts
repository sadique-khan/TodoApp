// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, TaskCreateInput, TaskUpdateInput } from "../types/task";
import { useApi } from "../hooks/useApi";
import * as taskApi from "../api/taskApi";

export const useTasks = () => {
  const api = useApi();
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getTasks(api),
  });
};

export const useTask = (id: string) => {
  const api = useApi();
  return useQuery<Task>({
    queryKey: ["tasks", id],
    queryFn: () => taskApi.getTaskById(api, id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskCreateInput) => taskApi.createTask(api, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTask = (id: string) => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskUpdateInput) => taskApi.updateTask(api, id, payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const prev = qc.getQueryData<Task[]>(["tasks"]);
      if (prev) {
        qc.setQueryData<Task[]>(
          ["tasks"],
          prev.map((t) => (t.id === id ? { ...t, ...payload } as Task : t))
        );
      }
      return { prev };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(["tasks"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });
};

export const useDeleteTask = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(api, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};