import { getTransactionReceipt } from "../services/transaction_service.js";
import blockchainListenerQueue from "./queue/blockchain_listener_queue.js";

blockchainListenerQueue.process(async (job, done) => {
  const { txHash, chainId } = job.data;

  try {
    const response = await getTransactionReceipt(txHash, chainId);

    console.log("[TRANSACRION]", response);
    if (!response || response.status === 0) return;
    console.log("GOT [TRANSACRION]", response);

    done(null, response);
  } catch (err) {
    console.error("Error processing transaction:", err);
    done(err);
  }
});
