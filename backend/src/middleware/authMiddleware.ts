// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}