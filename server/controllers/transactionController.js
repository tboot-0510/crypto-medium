import { errorWithStatusCode } from "../middelware/error_handler.js";
import CryptoPayment from "../models/crypto_payment.js";

const getTransactionStatus = async (req) => {
  try {
    const { id } = req.params;

    const cryptoPayment = await CryptoPayment.find({
      _id: id,
      user: req.userId,
    });

    if (cryptoPayment.length === 0)
      throw errorWithStatusCode(400, {
        message: `Transaction id is not found ${id}`,
      });

    return cryptoPayment[0];
  } catch (err) {
    console.log("[ERROR] err", err);
    throw errorWithStatusCode(500, { message: err.message });
  }
};

export { getTransactionStatus };
