import express, {Express,Request,Response} from 'express'
import { log } from 'node:console'
import { authRoutes } from './routers/authRoute';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import { taskRouter } from './controllers/taskContrller';
import { notificationRouter } from './routers/notificationRoute';
import http from "http";
import { Server } from "socket.io";
import { requireAuth } from './middleware/authMiddleware';
import { registerSocketHandlers } from './realtime/socket';
import cors from "cors"

const { PrismaClient } = require('@prisma/client');

dotenv.config();

export const prismaClient = new PrismaClient();


const app:Express = express();
const server = http.createServer(app);
 app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
  }));

const ioServer = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN, credentials: true }
});

// This assigns `io = ioServer` in your socket.ts
registerSocketHandlers(ioServer);

app.use(express.json());
app.use(cookieParser());
app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World')
});
app.use('/api/auth',authRoutes);
app.use('/api/tasks',requireAuth,taskRouter);
app.use('/api/notifications',notificationRouter)
app.use(errorHandler);

server.listen(3000,()=>{console.log("server is running");
})