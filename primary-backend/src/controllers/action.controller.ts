import client from "../db";
import { Request, Response } from "express";

export const availiableActions = async (req:Request,res:Response)=>{
    const actions = await client.availableAction.findMany({})
    if(actions.length === 0) {
        return res.status(404).json({message: "No actions available"})
    };
    return res.status(200).json(actions);
}

