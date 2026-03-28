import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod/v3";
export declare const validate: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map