import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import { parse } from "./parser";
import { sendEmail } from "./services/mailsender";


const TOPIC_NAME = "zap-events";

const client = new PrismaClient();

const kafka= new Kafka({
    clientId: 'worker',
    brokers: ['localhost:9092']
})

async function main()
{
    const consumer = kafka.consumer({groupId: 'worker-group'});
    await consumer.connect();
    await consumer.subscribe({topic: TOPIC_NAME,fromBeginning:true});
   
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
           console.log({
            partition,
            offset: message.offset,
            value: message.value?.toString(),
           })

        if (!message.value?.toString()) {
            return;
          }

          const parsedValue = JSON.parse(message.value?.toString());
          const zapRunId = parsedValue.zapRunId;
          const stage = parsedValue.stage;

          const zapRunDetails = await client.zapRun.findFirst({
            where:{
                id:zapRunId
            },
            include:{
                zap:{
                    include:{
                        actions:{
                            include:{
                                type:true
                            }
                        }
                    }
                }
            }
          })
 
          const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder===stage)
          if(!currentAction)
          {
            console.log("No Action Found")
            return;
          }
          
          const zapRunMetaData = zapRunDetails?.metadata
          console.log(`Zap Run Metadata: ${JSON.stringify(zapRunMetaData)}`);
          console.log(`Processing action: ${currentAction.type.name} for zap run ID: ${zapRunId}`);
          if(currentAction.type.name === "send-email")
          {
            console.log("Processing email action");
            const body = parse((currentAction.metadata as JsonObject)?.body as string,zapRunMetaData)
            console.log(`Email body: ${body}`);
            const to = parse((currentAction.metadata as JsonObject)?.email as string,zapRunMetaData)
            console.log(`Sending out email to ${to} and ${body}`)
            sendEmail(to,`Notification from github issue`,body)
          }
          if(currentAction.type.name ==='send-sol')
          {
            const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetaData);
            const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetaData);
            console.log(`Sending out SOL of ${amount} to address ${address}`);
          }



           await new Promise(r=> setTimeout(r,5000));
           await consumer.commitOffsets(
            [{
                topic:TOPIC_NAME,
                partition:partition,
                offset: (parseInt(message.offset) + 1).toString()
            }]
           )
        }
    })
}

main()