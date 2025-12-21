export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  assignedToId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskCreateInput {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assignedToId?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: Status;
  assignedToId?: string;
}