// src/api/taskApi.ts
import { Task, TaskCreateInput, TaskUpdateInput } from "../types/task";
import { AxiosInstance } from "axios";

// All functions accept `api` so you can inject the token-aware client
export const getTasks = async (api: AxiosInstance) => {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
};

export const getTaskById = async (api: AxiosInstance, id: string) => {
  const { data } = await api.get<Task>(`/tasks/${id}`);
  return data;
};

export const createTask = async (api: AxiosInstance, payload: TaskCreateInput) => {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
};

export const updateTask = async (api: AxiosInstance, id: string, payload: TaskUpdateInput) => {
  const { data } = await api.patch<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (api: AxiosInstance, id: string) => {
  await api.delete(`/tasks/${id}`);
};