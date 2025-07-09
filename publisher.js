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
        let message = 'this is a test messageJob';

        channel.assertQueue(queueName, {
            durable: false //even if there is no subscriber, the queue will always be available
        });
        //send message to buffer
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message: ${message}`)
        setTimeout(()=> {
            connection.close();
        }, 1000)
    })
})