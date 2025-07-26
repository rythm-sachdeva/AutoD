import express from 'express';
import cors from 'cors';
import { actionRouter } from './router/action.router';
import { triggerRouter } from './router/trigger.router';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/action',actionRouter)
app.use('/api/v1/trigger', triggerRouter)

app.listen(3000, ()=>{
    console.log("app is running on port 3000");
})