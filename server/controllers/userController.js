import blockchainListenerQueue from "../jobs/queue/blockchain_listener_queue.js";
import { errorWithStatusCode } from "../middelware/error_handler.js";

const handleCryptoPayment = (req) => {
  try {
    const { txHash } = req.body;

    if (!txHash)
      throw errorWithStatusCode(400, {
        message: "Transaction hash is not present",
      });

    blockchainListenerQueue.add(
      { txHash: txHash, chainId: 80001 },
      {
        attempts: 30,
        backoff: 2000,
      }
    );

    return { message: "Transaction is being processed" };
  } catch (err) {
    console.log("[ERROR] err", err);
    throw errorWithStatusCode(500, { message: err.message });
  }
};

export { handleCryptoPayment };
