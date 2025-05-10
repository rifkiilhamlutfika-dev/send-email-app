require("dotenv").config();

const amqp = require("amqplib/callback_api");
const nodemailer = require("nodemailer");

// make transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

amqp.connect(function (error0, connection) {
  if (error0) throw error0;
  connection.createChannel(function (error1, channel) {
    if (error1) throw error1;

    const queue = "send_message";

    channel.assertQueue(queue, { durable: false });
    console.log(
      " [*] Waiting for message in %s. To exit press CTRL + C",
      queue
    );

    channel.consume(
      queue,
      function (msg) {
        // console.log(msg.content.toString());

        const emailData = JSON.parse(msg.content.toString());
        console.log(" [x] You have a email from %s", emailData.name);

        // setup email
        const mailOption = {
          from: "rifkiilhamlutfika.dev@gmail.com",
          to: emailData.email,
          subject: `New message from ${emailData.name}`,
          text: emailData.message,
        };

        transporter.sendMail(mailOption, function (error, info) {
          if (error) {
            console.log(`error sending message : ${error}`);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
        // // di sini kamu bisa proses datanya, misalnya simpan ke DB atau kirim ke client
      },
      { noAck: true }
    );
  });
});
