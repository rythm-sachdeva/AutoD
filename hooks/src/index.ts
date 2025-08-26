import express from 'express';

const app = express();
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

app.use(express.json());

app.get('/hooks/catch/:userId/:zapId', async (req,res)=>{
    return res.json({message:"Hello From Hooks"})
})
app.post('/hooks/catch/:userId/:zapId', async (req,res)=>{
    const { userId, zapId } = req.params;
    const body = req.body;
    console.log('Received body:', body);
    console.log(`Received hook for user ${userId} and zap ${zapId}`);
    
    // store in db a new trigger
   await client.$transaction(async (tx)=>{
    const run =  await tx.zapRun.create({
        data:{
            zapId: zapId,
            metadata: body
        }
    })
    await tx.zapRunOutbox.create({
        data:{
            zapRunId: run.id,
            
        }
    })
   })
    res.json({
        "message": "Hook received successfully"
    })
    //push it on to the queue (Kafka/Redis)

})

app.listen(3001,()=>{
    console.log('Server is running on port 3001');
})