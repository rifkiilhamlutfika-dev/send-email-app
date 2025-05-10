require("dotenv").config();

const express = require("express");
const { response } = require("./components/resTemp");
const app = express();
const cors = require("cors");
const port = 8000 || 3000;

app.use(express.json());
app.use(cors());

const amqp = require("amqplib");

const QUEUE = "send_message";

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: false });
}

app.post("/send-message", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return response(res, 400, {}, "There is Missing Data");
  if (!channel) return response(res, 500, {}, "Rabbit not connected");

  const emailData = {
    name,
    email,
    message,
  };

  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(emailData)));
  response(res, 200, {}, `Message Sent to Queue - ${QUEUE}`);
});

app.get("/", (req, res) => {
  response(res, 200, ["ilham", "rifki", "lutfika"], "Server Error");
});

connectRabbitMQ().then(() => {
  app.listen(port, () => {
    console.log(`Api running in http://localhost:${port}`);
  });
});
