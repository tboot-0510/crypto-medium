import Queue from "bull";

const queueOptions = {
  redis: "redis://127.0.0.1:6379",
};

const blockchainListenerQueue = new Queue(
  "blockchainListenerJob",
  queueOptions
);

export default blockchainListenerQueue;
