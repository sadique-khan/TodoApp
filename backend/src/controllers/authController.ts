import { NextFunction, Request,Response } from "express";
import { prismaClient } from "..";
import bcrypt from "bcrypt"
import { threadCpuUsage } from "node:process";
import jwt from "jsonwebtoken";
import { any } from "zod";
import "dotenv/config";


const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
};

const JWT_SECRET = process.env.JWT_SECRET! 
const REFRESH_SECRET = process.env.REFRESH_SECRET! 
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";



export const register = async (req:Request,res:Response) =>{
    const {email,name,password} = req.body;
    if(!email || !name || !password){
        throw Error('all fields are required');
    }
    let user = await prismaClient.user.findFirst({where:{email}})
    if(user){
        throw Error("User already exists")
    }
    user = await prismaClient.user.create({
        data:{
            email,
            name,
            password: bcrypt.hashSync(password,10)
        }
    })
    res.json(user)
}

export const login = async (req:Request,res:Response) => {
    const {email,password} = req.body;
    const user = await prismaClient.user.findUnique({where:{email}});
    if (!user) throw new Error("Invalid Credentials");
    const ok = await bcrypt.compare(password,user.password);
    if (!ok) throw new Error("Invalid Credentials");


    const accessToken : string = jwt.sign({sub:user.id},JWT_SECRET,{expiresIn:ACCESS_TTL});
    const refreshToken = jwt.sign({ sub: user.id, type: "refresh" }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
    res.cookie("refresh_token", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } })
}

export const refresh = async (req:Request,res:Response) => {
    const token = req.cookies["refresh_token"];
    const payload = jwt.verify(token,REFRESH_SECRET)as any;
    if (payload.type !== "refresh") throw new Error("Invalid token");
    const accessToken = jwt.sign({sub:payload.sub},JWT_SECRET,{expiresIn:ACCESS_TTL});
    res.json({ accessToken });
}

export const logout = async (req:Request,res:Response)=>{
    res.clearCookie("refresh_token",{...cookieOpts});
    res.status(204).send()
}