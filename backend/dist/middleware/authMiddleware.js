"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!(auth === null || auth === void 0 ? void 0 : auth.startsWith("Bearer ")))
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const token = auth.slice(7);
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub;
        next();
    }
    catch (_a) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
//# sourceMappingURL=authMiddleware.js.map