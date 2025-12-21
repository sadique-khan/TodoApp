import { Request,Response,NextFunction } from "express";
import { ZodSchema } from "zod/v3";


export const validate = (schema: ZodSchema) => (
    req:Request,res:Response,next:NextFunction
) =>{
    try{
        req.body = schema.parse(req.body);
        next();
    }catch(error){
        next(error);
    }
}