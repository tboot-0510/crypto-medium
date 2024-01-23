import axios from "../lib/axios";

const transactionStatusApi = (transferId) =>
  axios.get(`transaction/${transferId}`);

export { transactionStatusApi };
