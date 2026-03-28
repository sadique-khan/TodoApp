"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    password: zod_1.z.string().min(6, "Password must be atleast 6 characters long"),
});
exports.login = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6)
});
//# sourceMappingURL=userSchema.js.map