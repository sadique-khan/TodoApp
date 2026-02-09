import { prismaClient } from "..";
import { io } from "../realtime/socket";

export const NotificationService = {
  async create(data: { userId: string; userEmail: string; type: string; message: string; taskId?: string }) {
    const notification = await prismaClient.notification.create({ data });

    // 🔔 Emit real-time notification to the user’s room
    io.to(`user:${data.userId}`).emit("notify", {
      id: notification.id,
      type: data.type,
      message: data.message,
      taskId: data.taskId,
      createdAt: notification.createdAt,
    });

    return notification;
  },

  list(userId: string) {
    return prismaClient.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async markRead( userId: string) {
    const updated = await prismaClient.notification.updateMany({
      where: { userId },
      data: { read: true },
      
    });
    const deleted = await prismaClient.notification.deleteMany({
    where: { userId },
    });


    // Optional: emit a “read” event
    if (updated.count > 0) {
      io.to(`user:${userId}`).emit("notify", {
        type: "NOTIFICATION_READ",
      });
    }

    return updated;
  },
};