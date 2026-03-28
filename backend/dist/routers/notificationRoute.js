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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const notificationController_1 = require("../controllers/notificationController");
exports.notificationRouter = (0, express_1.Router)();
exports.notificationRouter.use(authMiddleware_1.requireAuth);
exports.notificationRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield notificationController_1.NotificationService.list(req.userId);
    yield notificationController_1.NotificationService.markRead(req.userId);
    console.log("userId in notifications route:", req.userId);
    res.json(list);
}));
//# sourceMappingURL=notificationRoute.js.map