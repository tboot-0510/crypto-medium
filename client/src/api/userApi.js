import axios from "../lib/axios";

const cryptoPaymentApiHandler = (txHash, postId) =>
  axios.post("user/crypto_payment", { txHash, postId });

export { cryptoPaymentApiHandler };
