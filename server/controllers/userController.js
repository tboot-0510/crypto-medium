import Post from "../models/post.js";
import { StatusEnum } from "../../client/src/utils/constants.js";
import blockchainListenerQueue from "../jobs/queue/blockchain_listener_queue.js";
import { errorWithStatusCode } from "../middelware/error_handler.js";
import CryptoPayment from "../models/crypto_payment.js";
import Stripe from "stripe";
import "dotenv/config";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const handleCryptoPayment = async (req) => {
  try {
    const { txHash, postId } = req.body;

    if (!txHash)
      throw errorWithStatusCode(400, {
        message: "Transaction hash is not present",
      });

    if (!postId)
      throw errorWithStatusCode(400, {
        message: "Post ID is not present",
      });

    const post = await Post.findById(postId);

    if (!post) {
      throw errorWithStatusCode(400, {
        message: "Post does not exist",
      });
    }

    const cryptoPayment = new CryptoPayment({
      user: req.userId,
      post: post._id,
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
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return { id: cryptoPayment._id };
  } catch (err) {
    console.log("[ERROR] err", err);
    throw errorWithStatusCode(500, { message: err.message });
  }
};

const handleStripePayment = async () => {
  const { amount, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: token.id,
      description: "Charge for test@example.com",
    });

    return {
      message: "Payment succesful",
    };
  } catch (err) {
    console.error(err);
    return {
      message: "Payment failed",
    };
  }
};

export { handleCryptoPayment, handleStripePayment };
