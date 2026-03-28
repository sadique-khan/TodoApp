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
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const __1 = require("..");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const cookieOpts = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
};
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        throw Error('all fields are required');
    }
    let user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (user) {
        throw Error("User already exists");
    }
    user = yield __1.prismaClient.user.create({
        data: {
            email,
            name,
            password: bcrypt_1.default.hashSync(password, 10)
        }
    });
    res.json(user);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield __1.prismaClient.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Invalid Credentials");
    const ok = yield bcrypt_1.default.compare(password, user.password);
    if (!ok)
        throw new Error("Invalid Credentials");
    const accessToken = jsonwebtoken_1.default.sign({ sub: user.id }, JWT_SECRET, { expiresIn: ACCESS_TTL });
    const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id, type: "refresh" }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
    res.cookie("refresh_token", refreshToken, Object.assign(Object.assign({}, cookieOpts), { maxAge: 7 * 24 * 60 * 60 * 1000 }));
    res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
});
exports.login = login;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies["refresh_token"];
    const payload = jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
    if (payload.type !== "refresh")
        throw new Error("Invalid token");
    const accessToken = jsonwebtoken_1.default.sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: ACCESS_TTL });
    res.json({ accessToken });
});
exports.refresh = refresh;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("refresh_token", Object.assign({}, cookieOpts));
    res.status(204).send();
});
exports.logout = logout;
//# sourceMappingURL=authController.js.map