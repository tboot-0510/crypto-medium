import { toast } from "react-toastify";
import {
  BLOCKCHAINS_ACCEPTED,
  formatMessage,
  isChainUnsupported,
  requestSwitchChain,
  stripErrorCodes,
  unsupportedPlugins,
  verifyAccountAndNetwork,
} from "./helpers";
import {
  walletAuthMessageToSign,
  walletConnectApiHandler,
} from "../../api/loginApi";
import { calculateMaticArticlePrice } from "../format";
import { fetchTokenPrice } from "../../api/tokenApi";
import { cryptoPaymentApiHandler } from "../../api/userApi";

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
  console.log("balance", balance);
};

const startCryptoPayment = async (articlePrice, account, closeModal) => {
  try {
    const errorNetwork = await verifyAccountAndNetwork(ethereum, account);

    if (errorNetwork) {
      toast.error(errorNetwork);
      closeModal();
      return;
    }

    const cryptoPrice = await fetchTokenPrice();

    if (!cryptoPrice.data.price) {
      toast.error("Failed to fetch MATIC price");
      return;
    }

    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            value: Number(
              calculateMaticArticlePrice(articlePrice, cryptoPrice.data.price)
            ).toString(16),
            gas: Number(21000).toString(16),
            to: "0x54639a506d5C0BF68e765775fb895c0d4413B5De",
          },
        ],
      })
      .then(async (txHash) => {
        console.log("txHash", txHash);
        const response = await cryptoPaymentApiHandler(txHash);
        console.log("response", response);
        // setIsProcessing(false);
        //   const interval = setInterval(() => {
        //     transferStatusApi(resp.data.id).then((result) => {
        //         if (result.data.state === 'minted') {
        //             clearInterval(interval);
        //             reloadNft();
        //             closeModal();
        //             dispatch(
        //                 updatePendingTransaction({
        //                     transaction_id: '',
        //                     nft_id: '',
        //                 }),
        //             );

        //             queryClient.refetchQueries(['loadMyNfts', walletAddress]);
        //         }
        //         if (result.data.state === 'mint_failed') {
        //             clearInterval(interval);
        //             setIsProcessing(false);
        //             closeModal();
        //             dispatch(
        //                 updatePendingTransaction({
        //                     transaction_id: '',
        //                     nft_id: '',
        //                 }),
        //             );
        //             toast.error(t('pagesNftDetails:transfer_failed'));
        //         }
        //     });
        // }, 2000);
      })
      .catch((error) => {
        // setIsProcessing(false);
        toast.error(stripErrorCodes(error));
      });
  } catch (error) {
    toast.error(error.message);
  }
};

export { connectWithMetamask, startCryptoPayment };
