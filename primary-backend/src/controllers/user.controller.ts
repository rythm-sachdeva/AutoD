import client from "../db";
import { Request, Response } from "express";
import { UserSchema } from "../types";
import bcrypt from "bcrypt";

export const signUp = async (req:Request,res:Response)=>{
    const body = req.body;
   const parsedData = UserSchema.safeParse(body);
    if(parsedData.success === false)
    {
        return res.status(411).json({
            message: "Invalid data",
            error: parsedData.error
        });
    }
    
    const user = await client.user.findFirst({
        where:{
           email: parsedData.data.email 
        } 
    })
    if(user)
    {
        return res.status(409).json({
            message: "User already exists with this email"})
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password,10);
 
    //@ts-ignore
    const createdUser =   await client.user.create({
        data:{
            name: parsedData.data.username,
            email: parsedData.data.email,
            password: hashedPassword
        }
    });
    
    return res.status(201).json({message:"Sign Up Success",
        username:createdUser.name,
        email: createdUser.email
    })
}

