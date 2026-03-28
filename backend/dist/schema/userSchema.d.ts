import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const login: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=userSchema.d.ts.map