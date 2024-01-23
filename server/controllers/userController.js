import { StatusEnum } from "../../client/src/utils/constants.js";
import blockchainListenerQueue from "../jobs/queue/blockchain_listener_queue.js";
import { errorWithStatusCode } from "../middelware/error_handler.js";
import CryptoPayment from "../models/crypto_payment.js";

const handleCryptoPayment = async (req) => {
  try {
    const { txHash } = req.body;

    if (!txHash)
      throw errorWithStatusCode(400, {
        message: "Transaction hash is not present",
      });

    console.log("req.userId", req.userId);
    console.log("req.userId", req.body);

    const cryptoPayment = new CryptoPayment({
      user: req.userId,
      hash: txHash,
      status: StatusEnum.pending,
    });

    await cryptoPayment.save();

    blockchainListenerQueue.add(
      { txHash: txHash, chainId: 80001, cryptoPaymentId: cryptoPayment._id },
      {
        attempts: 20,
        backoff: {
          type: "fixed",
          delay: 2000,
        },
      }
    );

    return { id: cryptoPayment._id };
  } catch (err) {
    console.log("[ERROR] err", err);
    throw errorWithStatusCode(500, { message: err.message });
  }
};

export { handleCryptoPayment };
