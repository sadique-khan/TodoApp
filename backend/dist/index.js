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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const authRoute_1 = require("./routers/authRoute");
const errorHandler_1 = require("./middleware/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const taskContrller_1 = require("./controllers/taskContrller");
const notificationRoute_1 = require("./routers/notificationRoute");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const authMiddleware_1 = require("./middleware/authMiddleware");
const socket_1 = require("./realtime/socket");
const cors_1 = __importDefault(require("cors"));
const { PrismaClient } = require('@prisma/client');
dotenv_1.default.config();
exports.prismaClient = new PrismaClient();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));
const ioServer = new socket_io_1.Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN, credentials: true }
});
// This assigns `io = ioServer` in your socket.ts
(0, socket_1.registerSocketHandlers)(ioServer);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/api', (req, res) => {
    res.send('Hello World');
});
app.use('/api/auth', authRoute_1.authRoutes);
app.use('/api/tasks', authMiddleware_1.requireAuth, taskContrller_1.taskRouter);
app.use('/api/notifications', notificationRoute_1.notificationRouter);
app.use(errorHandler_1.errorHandler);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.prismaClient.$connect();
            console.log('Connected to database');
            server.listen(3000, () => {
                console.log('Server is running on port 3000');
            });
        }
        catch (err) {
            console.error('Failed to connect to database:', err);
            process.exit(1);
        }
    });
}
// Graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prismaClient.$disconnect();
    console.log('Prisma disconnected');
    process.exit(0);
}));
startServer();
//# sourceMappingURL=index.js.map