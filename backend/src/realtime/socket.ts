import { Server } from "socket.io";

export let io: Server;

export function registerSocketHandlers(server: Server) {
  io = server;

  io.on("connection", (socket) => {

    // Join global tasks room
    socket.join("tasks");

    // Authenticate (optional) to join user room
    socket.on("user:join", (userId: string) => {
      socket.join(`user:${userId}`);

      // Send a test notification to this user
      io.to(`user:${userId}`).emit("notify", {
        type: "welcome",
        message: `Hello user ${userId}, you are now subscribed to notifications.`,
      });
    });

    // Join a specific task room
    socket.on("task:join", (taskId: string) => {
      socket.join(`task:${taskId}`);

      // Send a test notification to this task room
      io.to(`task:${taskId}`).emit("notify", {
        type: "task-update",
        message: `Task ${taskId} has been joined.`,
      });
    });

    socket.on("disconnect", () => {
    });
  });
}