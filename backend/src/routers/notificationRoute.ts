import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { NotificationService } from "../controllers/notificationController";

export const notificationRouter = Router();
notificationRouter.use(requireAuth);

notificationRouter.get("/", async (req, res) => {
  const list = await NotificationService.list((req as any).userId);
  await NotificationService.markRead((req as any).userId)
  
  console.log("userId in notifications route:", (req as any).userId);
  res.json(list);
});
