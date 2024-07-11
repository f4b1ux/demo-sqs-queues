import {DeleteMessageCommand, GetQueueUrlCommand, ReceiveMessageCommand, SQSClient} from '@aws-sdk/client-sqs'

const main = async () => {
  const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const { QueueUrl } = await sqsClient.send(new GetQueueUrlCommand({ QueueName: process.env.AWS_SQS_QUEUE_NAME }));

  while (true) {
    console.log('Polling SQS queue...');

    const response = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl,
        WaitTimeSeconds: 20,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 10,
      })
    );

    const messages = response.Messages || [];

    for (const { MessageId, ReceiptHandle, Body } of messages) {
      console.log(`Received message ${Body} with id ${MessageId}`);

      await sqsClient.send(
        new DeleteMessageCommand({ QueueUrl, ReceiptHandle })
      )
      console.log('Message deleted!')
    }
  }
};

main().catch(console.error)