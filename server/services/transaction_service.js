import getAlchemyProvider from "../providers/provider.js";

const getTransactionByHash = async (txHash, chainId) => {
  const response = await getAlchemyProvider(chainId).getTransaction(txHash);

  return {
    ...response,
  };
};

const getTransactionReceipt = async (txHash, chainId) => {
  const response = await getAlchemyProvider(chainId).getTransactionReceipt(
    txHash
  );

  return {
    ...response,
  };
};

export { getTransactionByHash, getTransactionReceipt };
