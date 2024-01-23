import { errorWithStatusCode } from "../middelware/error_handler.js";
import CryptoPayment from "../models/crypto_payment.js";

const getTransactionStatus = async (req) => {
  try {
    const { transactionId } = req.params;

    console.log("transactionId", transactionId, req.userId);

    const cryptoPayment = await CryptoPayment.find({
      _id: transactionId,
      user: req.userId,
    });

    console.log("crypto", cryptoPayment);

    if (!cryptoPayment)
      throw errorWithStatusCode(400, {
        message: "Transaction id is not found ${}",
      });

    return { transaction: cryptoPayment };
  } catch (err) {
    console.log("[ERROR] err", err);
    throw errorWithStatusCode(500, { message: err.message });
  }
};

export { getTransactionStatus };
