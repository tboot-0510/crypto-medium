import CryptoPayment from "../models/crypto_payment.js";
import Transaction from "../models/transaction.js";
import { getTransactionReceipt } from "../services/transaction_service.js";
import blockchainListenerQueue from "./queue/blockchain_listener_queue.js";

// node blockchain_listener_job.js
console.log("[JOB] running");

blockchainListenerQueue.process(async (job, done) => {
  const { txHash, chainId, cryptoPaymentId } = job.data;

  try {
    const response = await getTransactionReceipt(txHash, chainId);

    console.log("[TRANSACRION]", response);
    if (!response || response.status === 0) return;
    console.log("GOT [TRANSACRION]", response);

    const {
      from,
      to,
      status,
      hash,
      gasUsed,
      gasPrice,
      blockNumber,
      blockHash,
    } = response;

    const transaction = new Transaction({
      from,
      to,
      hash,
      status,
      gasUsed,
      gasPrice,
      blockNumber,
      blockHash,
    });

    await transaction.save();

    console.log("transaction saved", transaction._id);

    const cryptoPayment = await CryptoPayment.findById(cryptoPaymentId);

    console.log("cryptoPayment", cryptoPayment);
    if (!cryptoPayment) {
      const error = new Error(
        `No CryptoPayment found for ID: ${cryptoPaymentId}, Transaction ID ${transaction._id}`
      );
      return done(error);
    }

    cryptoPayment.transaction = transaction._id;
    cryptoPayment.status = status;
    await cryptoPayment.save();

    return done(null, response);
  } catch (err) {
    console.error("Error processing transaction:", err);
    done(err);
  }
});
