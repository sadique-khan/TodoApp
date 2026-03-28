import { Request, Response } from "express";
import "dotenv/config";
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const refresh: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map