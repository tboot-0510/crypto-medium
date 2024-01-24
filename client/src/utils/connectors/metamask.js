import { toast } from "react-toastify";
import {
  BLOCKCHAINS_ACCEPTED,
  formatMessage,
  isChainUnsupported,
  requestSwitchChain,
  unsupportedPlugins,
  verifyAccountAndNetwork,
} from "./helpers";
import {
  walletAuthMessageToSign,
  walletConnectApiHandler,
} from "../../api/loginApi";
import { fetchTokenPrice } from "../../api/tokenApi";

const { ethereum } = window;

const provider = ethereum;

const getSignature = async ({ from, msgParams }) => {
  const signature = await provider.request({
    method: "eth_signTypedData_v4",
    params: [from, msgParams],
  });
  return signature;
};

const getProvider = () => {
  if (!ethereum?.isMetaMask)
    return "componentsWallet:external_wallet.metamask.metamask_plugin";

  // eslint-disable-next-line no-underscore-dangle
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) {
    return "componentsWallet:external_wallet.wrong_plugin.brave";
  }
  const unsupportedPlugin = Object.keys(ethereum).find(
    (key) => unsupportedPlugins[key]
  );
  if (unsupportedPlugin) return unsupportedPlugins[unsupportedPlugin];
};

const connect = async () => {
  const errorGetReady = getProvider();

  if (errorGetReady) {
    toast.error(errorGetReady);
    return;
  }

  let chainId = parseInt(await provider.request({ method: "eth_chainId" }), 16);

  if (chainId && !BLOCKCHAINS_ACCEPTED.includes(chainId)) {
    chainId = await requestSwitchChain(provider, BLOCKCHAINS_ACCEPTED[0]);
    const errorMessage = isChainUnsupported(chainId);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
  }

  await provider.request({
    method: "wallet_requestPermissions",
    params: [{ eth_accounts: {} }],
  });

  const accounts = await provider.request({
    method: "eth_requestAccounts",
  });

  const account = accounts[0];

  return { account, chainId };
};

const connectWithMetamask = async (type) => {
  try {
    const connectionInfo = await connect();

    if (connectionInfo && connectionInfo.account && connectionInfo.chainId) {
      const { account, chainId } = connectionInfo;
      try {
        const { message } = (
          await walletAuthMessageToSign({
            account,
            chain_id: chainId,
          })
        ).data;
        const msgParams = formatMessage(chainId, message);
        const signature = await getSignature({ from: account, msgParams });

        return await walletConnectApiHandler({
          signatureParams: msgParams,
          signature,
          type,
        });
      } catch (error) {
        console.log("error", error);
        toast.error(error.message);
        return error;
      }
    }
  } catch (err) {
    toast.error(err.message);
  }
};

const checkBalance = async (account) => {
  const balance = await ethereum.request({
    method: "eth_getBalance",
    params: [account, "latest"],
  });
  return balance;
};

const getTokenPrice = async (account, callback) => {
  const errorNetwork = await verifyAccountAndNetwork(ethereum, account);

  if (errorNetwork) {
    toast.error(errorNetwork);
    callback();
    return;
  }

  return await fetchTokenPrice();
};

export { connectWithMetamask, checkBalance, getTokenPrice };
