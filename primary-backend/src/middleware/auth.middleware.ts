import { Response,Request,NextFunction } from "express"


export const authMiddleWare =(req:Request,res:Response,next:NextFunction) =>
{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token)
    {
        res.status(401).json({message:"User Not Logged In"});
    }
    next();
}