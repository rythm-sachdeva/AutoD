import express from 'express';

const app = express();


app.post('/hooks/catch/:userId/:zapId',(req,res)=>{
    const { userId, zapId } = req.params;
    console.log(`Received hook for user ${userId} and zap ${zapId}`);
    
    // store in db a new trigger

    //push it on to the queue (Kafka/Redis)
    
})