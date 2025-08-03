import { Response,Request,NextFunction } from "express"
import jwt from "jsonwebtoken"


export const authMiddleWare =(req:Request,res:Response,next:NextFunction) =>
{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token)
    {
        res.status(401).json({message:"User Not Logged In"});
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET!)
    if(!decoded)
    {
      return res.status(401).json({message:"Invalid Access Token"})
    }
    //@ts-ignore
    req.id = decoded.id
    next();
}