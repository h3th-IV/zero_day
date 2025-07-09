const amqplib = require('amqplib/callback_api');


//connect to the mqServer
amqplib.connect(`amqp://127.0.0.1`, (error, connection) => {
    if (error){
       throw error;
    }
    //create a channel
    connection.createChannel((error, channel) => {
        if(error){
            throw error;
        }
        let queueName = 'jobsQueue';
        channel.assertQueue(queueName, {
            durable: false //even if there is no subscriber, the queue will always be available
        });
        //get message from queue
        channel.consume(queueName, (msg) => {
            console.log(`Received message: ${msg.content.toString}`)
            //explicitly acknowledge each message received, once message acknowledged, delete message
            channel.ack(msg)
        }, {
            //implicitly acknowledge the message
            noAck: true //send acknowledgment that all message has been received(on a single connect consume by the consumer)
        })
    })
})