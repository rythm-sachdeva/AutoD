import { Response,Request } from "express"
import { ZapCreateSchema } from "../types"
import client from "../db"

export const zapCreator = async (req:Request,res:Response) =>{
    //@ts-ignore
    const id = req.id
    const body = req.body
    const parsedData = ZapCreateSchema.safeParse(body)
    if(!parsedData.success)
    {
        res.status(400).json({message:"Wrong Inputs"})
    }

    const zapId = await client.$transaction(async tx=>{
        const zap = await client.zap.create({
            data:{
                userId: parseInt(id),
                triggerId:"",
                actions:{
                    create:parsedData.data?.actions.map((x,index)=>({
                        actionId:x.availiableActionId,
                        sortingOrder:index,
                        metadata:x.actionMetaData
                    }))
                }

            }
        })
       
        const trigger = await tx.trigger.create({
            data: {
                 //@ts-ignore
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
            }
        });

        await client.zap.update({
            where:{
                id : zap.id
            },
            data:
            {
                triggerId:trigger.id
            }
        })

        return zap.id;
    })

    return res.status(200).json({message:"Zap Created Successfully",zapId})

}


export const zapsGetter= async (req:Request,res:Response)=>{
    //@ts-ignore
    const id = req.id;
    const zaps = await client.zap.findMany({
        where:{
            userId:id
        },
        include:{
            triggers:{
                include:{
                    type:true
                }
            },
            actions:{
                include:{
                    type:true
                }
            }
        }
    })

    return res.status(200).json({
        zaps
    })
    

}

export const getZap = async (req:Request,res:Response)=>{
   //@ts-ignore
   const id = req.id 
   const zapId = req.params.zapId

   const zap = client.zap.findFirst({
    where:{
        id:zapId,
        userId:id
    },
    include: {
            actions: {
               include: {
                    type: true
               }
            },
            triggers:{
                include:{
                    type:true
                }
            }
        }
   })

   return res.status(200).json({zap})
}