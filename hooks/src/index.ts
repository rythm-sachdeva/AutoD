import express from 'express';

const app = express();
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();


app.post('/hooks/catch/:userId/:zapId', async (req,res)=>{
    const { userId, zapId } = req.params;
    const body = req.body;
    console.log(`Received hook for user ${userId} and zap ${zapId}`);
    
    // store in db a new trigger
   await client.$transaction(async (tx)=>{
    const run =  await client.zapRun.create({
        data:{
            zapId: zapId
        }
    })
    await client.zapRunOutbox.create({
        data:{
            zapRunId: run.id,
            //@ts-ignore
            metadata: body
        }
    })
   })
    
    //push it on to the queue (Kafka/Redis)

})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})