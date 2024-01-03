import { toast } from "react-toastify";
import {
  BLOCKCHAINS_ACCEPTED,
  formatMessage,
  isChainUnsupported,
  requestSwitchChain,
  unsupportedPlugins,
} from "./helpers";
import { walletAuthMessageToSign } from "../../api/loginApi";

const connectWithMetamask = async () => {
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

    let chainId = parseInt(
      await provider.request({ method: "eth_chainId" }),
      16
    );

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

  try {
    const connectionInfo = await connect();

    if (connectionInfo && connectionInfo.account && connectionInfo.chainId) {
      const { account, chainId } = connectionInfo;
      try {
        const { message } = (
          await walletAuthMessageToSign({ account, chain_id: chainId })
        ).data;
        const msgParams = formatMessage(chainId, message);
        const signature = await getSignature({ from: account, msgParams });
      } catch (error) {
        toast.error(error.message);
      }
    }
  } catch (e) {
    toast.error(e.message);
  }
};

// const sendWalletSignature = async ({ chainId, account, walletMeta, signingMethod, loginApi }) => {
//     const { message } = (await walletAuthMessageToSign({ account, chain_id: chainId })).data;
//     try {
//         const msgParams = formatMessage(chainId, message);

//         const signature = await signingMethod({ from: account, msgParams });

//         await loginApi({
//             signature_params: msgParams,
//             signature,
//             wallet_meta: walletMeta,
//         });

//         meApi().then((meResp) => {
//             localStorage.setItem('authenticated', true);
//             dispatch(loginUser(meResp?.data));
//             if (meResp?.data?.missing_attributes?.length > 0) {
//                 updateStep(REDIRECT_CONNECTION_MODAL_USER_INFO);
//             } else {
//                 closeModal();
//                 toast.success(t('toast.logged_in'), {
//                     toastId: 'toast.logged_in',
//                 });
//             }
//         });
//     } catch (error) {
//         if (localStorage.getItem('walletconnect')) {
//             localStorage.removeItem('walletconnect');
//         }
//         setIsSigningWallet(false);
//         toast.error(t(stripErrorCodes(error)));
//     }
// };

export { connectWithMetamask };
