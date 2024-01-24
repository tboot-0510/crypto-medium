import pkg from "lodash";
const { isEmpty } = pkg;
import { StatusEnum } from "../../client/src/utils/constants.js";
import CryptoPayment from "../models/crypto_payment.js";
import Transaction from "../models/transaction.js";
import { getTransactionReceipt } from "../services/transaction_service.js";
import blockchainListenerQueue from "./queue/blockchain_listener_queue.js";
import "dotenv/config";
import { connect } from "mongoose";

// node blockchain_listener_job.js

const uri = process.env.MONGODB_URI;
console.log("[JOB] running");

connect(uri)
  .then(async () => {
    console.log("Pinged your job. You successfully connected to MongoDB!");
  })
  .catch((err) => console.error(err));

blockchainListenerQueue.process(async (job, done) => {
  const { txHash, chainId, cryptoPaymentId } = job.data;

  try {
    const response = await getTransactionReceipt(txHash, chainId);

    console.log("[TRANSACRION]", response);
    if (!response || isEmpty(response)) return done(new Error("No response"));

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

    const cryptoPayment = await CryptoPayment.findById(cryptoPaymentId);

    if (!cryptoPayment) {
      const error = new Error(
        `No CryptoPayment found for ID: ${cryptoPaymentId}, Transaction ID ${transaction._id}`
      );
      done(error);
    }

    cryptoPayment.transaction = transaction._id;
    cryptoPayment.status = status ? StatusEnum.minted : StatusEnum.mint_failed;

    await cryptoPayment.save();

    done();
  } catch (err) {
    console.error("Error processing transaction:", err);
    done(new Error(err));
  }
});
