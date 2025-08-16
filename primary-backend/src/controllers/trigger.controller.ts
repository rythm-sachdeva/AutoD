import client from "../db";
import { Request, Response } from "express";

export const availableTriggers = async (req:Request,res:Response)=>{
    const triggers = await client.availableTrigger.findMany({});
    console.log("Request For Available triggers")
    if(triggers.length === 0)
    {
        return res.status(404).json({message:"No triggers available"});
    }
    return res.status(200).json(triggers);
}
