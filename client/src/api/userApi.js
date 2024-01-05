import axios from "../lib/axios";

const cryptoPaymentApiHandler = (txHash) =>
  axios.post("user/crypto_payment", { txHash });

export { cryptoPaymentApiHandler };
