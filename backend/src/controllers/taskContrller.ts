// backend/src/domain/tasks/task.controller.ts
import { Request, Response, Router } from "express";
import { z } from "zod";
import { prismaClient } from "..";
import { NotificationService } from "./notificationController";
import { io } from "../realtime/socket";

const TaskDTO = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1),
  dueDate: z.string().transform((s) => new Date(s)),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional(),
  assignedToId: z.string().nullable().optional(),
});

export const taskRouter = Router();

// CREATE
taskRouter.post("/", async (req: Request, res: Response) => {
  const parsed = TaskDTO.parse(req.body);
  const creatorId = (req as any).userId;

  const task = await prismaClient.task.create({
    data: { ...parsed, creatorId },
  });

  io.to("tasks").emit("notify", {
    type: "TASK_CREATED",
    message: `Task "${task.title}" was created`,
    task,
  });
  if (task.assignedToId) {
    await NotificationService.create({
      userId: task.assignedToId,
      type: "TASK_ASSIGNED",
      message: `You were assigned to task "${task.title}".`,
      taskId: task.id,
    });
    io.to(`user:${task.assignedToId}`).emit("notify", {
      type: "TASK_ASSIGNED",
      message: `You were assigned to task "${task.title}"`,
      task: { id: task.id, title: task.title },
    });
  }

  res.status(201).json(task);
});

// GET SINGLE
taskRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const task = await prismaClient.task.findUnique({
    where: { id },
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// UPDATE
taskRouter.patch("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const parsed = TaskDTO.partial().parse(req.body);
  if (!("assignedToId" in req.body)) {
  parsed.assignedToId = null;
}


  const before = await prismaClient.task.findUnique({ where: { id } });
  const updated = await prismaClient.task.update({ where: { id }, data: parsed });

  io.to("tasks").emit("notify", {
    type: "TASK_UPDATED",
    message: `Task "${updated.title}" was updated`,
    task: updated,
  });

  // Notify if assignee changed
  if (before?.assignedToId !== updated.assignedToId && updated.assignedToId) {
    await NotificationService.create({
      userId: updated.assignedToId,
      type: "TASK_ASSIGNED",
      message: `You were assigned to task "${updated.title}".`,
      taskId: updated.id,
    });

    io.to(`user:${updated.assignedToId}`).emit("notify", {
      type: "TASK_ASSIGNED",
      message: `You were assigned to task "${updated.title}"`,
      task: { id: updated.id, title: updated.title },
    });
  }

  res.json(updated);
});

// LIST
taskRouter.get("/", async (req: Request, res: Response) => {
  const { status, priority, sortByDue, overdue } = req.query;
  const userId = (req as any).userId;

  const tasks = await prismaClient.task.findMany({
    where: {
      OR: [
        { creatorId: userId ? String(userId) : undefined },
        { assignedToId: userId ? String(userId) : undefined },
      ],
      status: status ? String(status) : undefined,
      priority: priority ? String(priority) : undefined,
      ...(overdue === "true"
        ? { dueDate: { lt: new Date() }, status: { not: "COMPLETED" } }
        : {}),
    },
    orderBy: sortByDue
      ? { dueDate: sortByDue === "asc" ? "asc" : "desc" }
      : { updatedAt: "desc" },
  });

  res.json(tasks);
});

// DELETE
taskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  await prismaClient.task.delete({ where: { id } });

  io.to("tasks").emit("notify", {
    type: "TASK_DELETED",
    message: `Task ${id} was deleted`,
    taskId: id,
  });

  res.status(204).send();
});