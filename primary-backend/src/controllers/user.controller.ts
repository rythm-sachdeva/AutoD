import client from "../db";
import { Request, Response } from "express";
import { SigninSchema, UserSchema } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { email } from "zod";

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
    const {password,...user_object} = createdUser 
     const accessToken  = jwt.sign(user_object,process.env.JWT_SECRET!,{
        expiresIn:'2h'
    })

    
    return res.status(201).json({message:"Sign Up Success",
        username:createdUser.name,
        email: createdUser.email,
        accessToken

    })
}

export const signin = async(req:Request,res:Response)=>{
    const body = req.body
    const parsedData = SigninSchema.safeParse(body)
    if(!parsedData.success)
    {
        return res.status(411).json({message:"Wrong Input"})
    }
    const user = await client.user.findFirst({
        where:{
            name:parsedData.data.username
        }
    })
    if(!user)
    {
        return res.status(404).json({message:"User With this username does not exist"});
    }
    const comp : boolean = await bcrypt.compare(parsedData.data.password,user.password)
    
    if(!comp)
    {
      return res.status(401).json({message:"Incorrect Password"})
    }
    const {password,...user_object } = user
    const accessToken = jwt.sign(user_object,process.env.JWT_SECRET!,{
        expiresIn:'24h'
    })
    
    return res.status(200).json({message:"Loged In Successfully",accessToken})
    
}
export const userDetails = async (req:Request,res:Response)=>{
    //@ts-ignore
    const id = req.id
    const user = await client.user.findFirst({
        where:{
            id,
            
        },
        select:{
            name:true,
            email:true
        }
    }) 

    return res.status(200).json({name:user?.name,email:user?.email});
    
}

