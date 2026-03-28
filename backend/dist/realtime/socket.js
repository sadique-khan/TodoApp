"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.registerSocketHandlers = registerSocketHandlers;
function registerSocketHandlers(server) {
    exports.io = server;
    exports.io.on("connection", (socket) => {
        // Join global tasks room
        socket.join("tasks");
        // Authenticate (optional) to join user room
        socket.on("user:join", (userId) => {
            socket.join(`user:${userId}`);
            // Send a test notification to this user
            exports.io.to(`user:${userId}`).emit("notify", {
                type: "welcome",
                message: `Hello user ${userId}, you are now subscribed to notifications.`,
            });
        });
        // Join a specific task room
        socket.on("task:join", (taskId) => {
            socket.join(`task:${taskId}`);
            // Send a test notification to this task room
            exports.io.to(`task:${taskId}`).emit("notify", {
                type: "task-update",
                message: `Task ${taskId} has been joined.`,
            });
        });
        socket.on("disconnect", () => {
        });
    });
}
//# sourceMappingURL=socket.js.map