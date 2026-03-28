"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
// backend/src/domain/tasks/task.controller.ts
const express_1 = require("express");
const zod_1 = require("zod");
const __1 = require("..");
const notificationController_1 = require("./notificationController");
const socket_1 = require("../realtime/socket");
const TaskDTO = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(100),
    description: zod_1.z.string().trim().min(1),
    dueDate: zod_1.z.string().transform((s) => new Date(s)),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    status: zod_1.z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional(),
    assignedToId: zod_1.z.string().nullable().optional(),
    assignedToUserEmail: zod_1.z.string().nullable().optional(),
});
exports.taskRouter = (0, express_1.Router)();
// CREATE
exports.taskRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = TaskDTO.parse(req.body);
    const creatorId = req.userId;
    if (parsed.assignedToUserEmail) {
        const assginedTo = yield __1.prismaClient.user.findFirst({ where: { email: parsed.assignedToUserEmail } });
        if (!assginedTo) {
            return res.status(404).json({ error: "Assined User not found" });
        }
        parsed.assignedToId = assginedTo.id;
    }
    ;
    const task = yield __1.prismaClient.task.create({
        data: Object.assign(Object.assign({}, parsed), { creatorId }),
    });
    socket_1.io.to("tasks").emit("notify", {
        type: "TASK_CREATED",
        message: `Task "${task.title}" was created`,
        task,
    });
    if (task.assignedToId) {
        yield notificationController_1.NotificationService.create({
            userId: task.assignedToId,
            userEmail: task.assignedToUserEmail,
            type: "TASK_ASSIGNED",
            message: `You were assigned to task "${task.title}".`,
            taskId: task.id,
        });
        socket_1.io.to(`user:${task.assignedToId}`).emit("notify", {
            type: "TASK_ASSIGNED",
            message: `You were assigned to task "${task.title}"`,
            task: { id: task.id, title: task.title },
        });
    }
    res.status(201).json(task);
}));
// GET SINGLE
exports.taskRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield __1.prismaClient.task.findUnique({
        where: { id },
    });
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
}));
// UPDATE
exports.taskRouter.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const parsed = TaskDTO.partial().parse(req.body);
    if (!("assignedToId" in req.body)) {
        parsed.assignedToId = null;
    }
    if (!("assignedToUserEmail" in req.body)) {
        parsed.assignedToUserEmail = null;
    }
    const before = yield __1.prismaClient.task.findUnique({ where: { id } });
    const updated = yield __1.prismaClient.task.update({ where: { id }, data: parsed });
    socket_1.io.to("tasks").emit("notify", {
        type: "TASK_UPDATED",
        message: `Task "${updated.title}" was updated`,
        task: updated,
    });
    // Notify if assignee changed
    if ((before === null || before === void 0 ? void 0 : before.assignedToId) !== updated.assignedToId && updated.assignedToId) {
        yield notificationController_1.NotificationService.create({
            userId: updated.assignedToId,
            userEmail: updated.assignedToUserEmail,
            type: "TASK_ASSIGNED",
            message: `You were assigned to task "${updated.title}".`,
            taskId: updated.id,
        });
        socket_1.io.to(`user:${updated.assignedToId}`).emit("notify", {
            type: "TASK_ASSIGNED",
            message: `You were assigned to task "${updated.title}"`,
            task: { id: updated.id, title: updated.title },
        });
    }
    res.json(updated);
}));
// LIST
exports.taskRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, priority, sortByDue, overdue } = req.query;
    const userId = req.userId;
    const tasks = yield __1.prismaClient.task.findMany({
        where: Object.assign({ OR: [
                { creatorId: userId ? String(userId) : undefined },
                { assignedToId: userId ? String(userId) : undefined },
            ], status: status ? String(status) : undefined, priority: priority ? String(priority) : undefined }, (overdue === "true"
            ? { dueDate: { lt: new Date() }, status: { not: "COMPLETED" } }
            : {})),
        orderBy: sortByDue
            ? { dueDate: sortByDue === "asc" ? "asc" : "desc" }
            : { updatedAt: "desc" },
    });
    res.json(tasks);
}));
// DELETE
exports.taskRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield __1.prismaClient.task.delete({ where: { id } });
    socket_1.io.to("tasks").emit("notify", {
        type: "TASK_DELETED",
        message: `Task ${id} was deleted`,
        taskId: id,
    });
    res.status(204).send();
}));
//# sourceMappingURL=taskContrller.js.map