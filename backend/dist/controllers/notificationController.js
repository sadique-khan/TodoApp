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
exports.NotificationService = void 0;
const __1 = require("..");
const socket_1 = require("../realtime/socket");
exports.NotificationService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield __1.prismaClient.notification.create({ data });
            // 🔔 Emit real-time notification to the user’s room
            socket_1.io.to(`user:${data.userId}`).emit("notify", {
                id: notification.id,
                type: data.type,
                message: data.message,
                taskId: data.taskId,
                createdAt: notification.createdAt,
            });
            return notification;
        });
    },
    list(userId) {
        return __1.prismaClient.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },
    markRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield __1.prismaClient.notification.updateMany({
                where: { userId },
                data: { read: true },
            });
            const deleted = yield __1.prismaClient.notification.deleteMany({
                where: { userId },
            });
            // Optional: emit a “read” event
            if (updated.count > 0) {
                socket_1.io.to(`user:${userId}`).emit("notify", {
                    type: "NOTIFICATION_READ",
                });
            }
            return updated;
        });
    },
};
//# sourceMappingURL=notificationController.js.map