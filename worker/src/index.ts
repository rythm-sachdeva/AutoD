import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-events";

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