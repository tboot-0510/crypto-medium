import Queue from "bull";

const blockchainListenerQueue = new Queue("blockchainListenerJob");

export default blockchainListenerQueue;
