import { toQuantity } from "ethers";
import { toast } from "react-toastify";

const numberDisplayed = 10;
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const bridge = "https://bridge.walletconnect.org";

const unsupportedPlugins = {
  isExodus: "Deactivate Exodus Wallet in order to use Metamask",
  isAvalanche: "Deactivate Avalanche Wallet in order to use Metamask",
  isKuCoinWallet: "Deactivate Kucoin Wallet in order to use Metamask",
  isPhantom: "Deactivate Phantom Wallet in order to use Metamask",
  isPortal: "Deactivate Portal Wallet in order to use Metamask",
  isTokenPocket: "Deactivate TokenPocket Wallet in order to use Metamask",
  isTokenary: "Deactivate Tokenary Wallet in order to use Metamask",
};

const getBlockchains = () => [80001]; //only mumbai

const BLOCKCHAINS_ACCEPTED = getBlockchains();

const verifiedBlockchains = {
  80001: {
    chainId: toQuantity(80001),
    chainName: "Mumbai Testnet",
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
  },
};

const formatMessage = (
  chainId,
  message,
  description = "Welcome to Medium, \n sign this message to verify it is you!"
) =>
  JSON.stringify({
    domain: {
      chainId,
      name: "Medium",
      version: "0.0.1",
    },

    message: {
      description,
      state: message,
    },
    primaryType: "Message",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      Message: [
        { name: "description", type: "string" },
        // { name: "state", type: "string" },
      ],
    },
  });

const formatWalletProviderString = (string) => {
  if (!string) {
    return "";
  }
  return (string[0].toUpperCase() + string.slice(1)).replace("_", " ");
};

const stripErrorCodes = (error) => {
  if (error.code === -32603) {
    return "Transaction underpriced. Add more Gas price to the transaction.";
  }
  if (error.code === 4100) {
    return "The linked account is not connected to the website.";
  }
  if (error.code === 4001) {
    return "You refused the transaction.";
  }
  try {
    // Error returned from Backend API
    return error.response.data.errors[0].message;
  } catch {
    return error.message;
  }
};

const addNetworkRequest = (chainId) => {
  const { chainId: id, chainName, rpcUrls } = verifiedBlockchains[chainId];
  return {
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: id,
        chainName,
        rpcUrls,
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
      },
    ],
  };
};

const switchToNetworkRequest = (chainId) => ({
  method: "wallet_switchEthereumChain",
  params: [{ chainId: toQuantity(chainId) }],
});

const requestSwitchChain = async (provider, chainId) => {
  try {
    await provider.request(switchToNetworkRequest(chainId));
    return chainId;
  } catch (switchError) {
    // This error code indicates that the user cancel the switchRequest
    if (switchError.code === 4001) {
      return "componentsWallet:external_wallet.blockchain_chain_id.switch_blockchain";
    }
    if (switchError.code === 4902) {
      try {
        await provider.request(addNetworkRequest(chainId));
        return chainId;
      } catch {
        return "componentsWallet:external_wallet.blockchain_chain_id.add_blockchain";
      }
    }
    return "componentsWallet:external_wallet.blockchain_chain_id.switch_blockchain";
  }
};

const isChainUnsupported = (chainId) => {
  if (BLOCKCHAINS_ACCEPTED.includes(chainId)) {
    return;
  }
  return "componentsWallet:external_wallet.blockchain_chain_id.switch_blockchain";
};

const switchNetwork = async (ethereum) => {
  try {
    await ethereum.request(switchToNetworkRequest(BLOCKCHAINS_ACCEPTED[0]));
  } catch (switchError) {
    // This error code indicates that the user cancel the switchRequest
    if (switchError.code === 4001) {
      return "componentsWallet:external_wallet.blockchain_chain_id.switch_blockchain";
    }

    if (switchError.code === 4902) {
      return "componentsWallet:external_wallet.blockchain_chain_id.add_blockchain";
    }
    return "componentsWallet:external_wallet.blockchain_chain_id.switch_blockchain";
  }
};

const verifyAccountAndNetwork = async (ethereum, walletAddress) => {
  const userAccounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  if (!userAccounts.length)
    return "componentsWallet:external_wallet.transaction_error.no_account_found";

  if (userAccounts[0].toLowerCase() !== walletAddress.toLowerCase()) {
    return "componentsWallet:external_wallet.transaction_error.not_connected";
  }

  const currentChainId = parseInt(
    await ethereum.request({ method: "eth_chainId" }),
    16
  );
  if (!BLOCKCHAINS_ACCEPTED.includes(currentChainId)) {
    const error = await switchNetwork(ethereum);
    return error;
  }
};

const changeWalletAccount = async (ethereum) => {
  await ethereum.request({
    method: "wallet_requestPermissions",
    params: [{ eth_accounts: {} }],
  });
  const userAccounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  return userAccounts?.[0];
};

const requestSwitchChainIdMetamask = async ({ t, ethereum }) => {
  try {
    await ethereum.request(switchToNetworkRequest(BLOCKCHAINS_ACCEPTED[0]));
    return BLOCKCHAINS_ACCEPTED[0];
  } catch (switchError) {
    // This error code indicates that the user cancel the switchRequest
    if (switchError.code === 4001) {
      toast.error(t("external_wallet.blockchain_chain_id.switch_blockchain"));
      return;
    }
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request(addNetworkRequest(BLOCKCHAINS_ACCEPTED[0]));
        return BLOCKCHAINS_ACCEPTED[0];
      } catch (addError) {
        // handle "add" error
        toast.error(t("external_wallet.blockchain_chain_id.add_blockchain"));
      }
    }
  }
};

const getChainId = async (t, ethereum) => {
  const currentChainId = parseInt(
    await ethereum.request({ method: "eth_chainId" }),
    16
  );
  if (BLOCKCHAINS_ACCEPTED.includes(currentChainId)) {
    return currentChainId;
  }
  const switchedChainId = await requestSwitchChainIdMetamask({ t, ethereum });

  if (BLOCKCHAINS_ACCEPTED.includes(switchedChainId)) {
    return currentChainId;
  }
};

const getSignature = async ({ from, msgParams }) => {
  const { ethereum } = window;
  const signature = await ethereum.request({
    method: "eth_signTypedData_v4",
    params: [from, msgParams],
  });
  return signature;
};

export {
  verifyAccountAndNetwork,
  BLOCKCHAINS_ACCEPTED,
  numberDisplayed,
  bridge,
  requestSwitchChain,
  switchNetwork,
  formatWalletProviderString,
  formatMessage,
  stripErrorCodes,
  addNetworkRequest,
  switchToNetworkRequest,
  isChainUnsupported,
  changeWalletAccount,
  verifiedBlockchains,
  getChainId,
  unsupportedPlugins,
  NULL_ADDRESS,
  getSignature,
};
