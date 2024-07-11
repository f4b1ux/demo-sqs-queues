import {GetQueueUrlCommand, SendMessageCommand, SQSClient} from '@aws-sdk/client-sqs';

let counter = 0;

setInterval(async () => {
  const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const { QueueUrl } = await sqsClient.send(new GetQueueUrlCommand({ QueueName: process.env.AWS_SQS_QUEUE_NAME }));

  await sqsClient.send(new SendMessageCommand({
    QueueUrl,
    MessageBody: 'Hello, world!',
    MessageGroupId: '1',
    MessageDeduplicationId: `${++counter}`,
  }));

  console.log('message sent!')
}, 3000);