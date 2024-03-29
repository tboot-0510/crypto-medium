import axios from "../lib/axios";
import qs from "qs";

const loginApiHandler = () =>
  axios.post("auth/login", {
    user: { name: "hello" },
  });

const logoutApiHandler = () => axios.post("auth/logout");

const signUpApiHandler = (userInfo) =>
  axios.post("auth/signup", {
    user: userInfo,
  });

const signUpWeb3ApiHandler = (userInfo) =>
  axios.post("auth/signup_web3", { user: userInfo });

const refetchTokenApiHandler = () => axios.get("auth/refresh");

const walletAuthMessageToSign = (params) =>
  axios.get("auth/start_sign_in_web3", {
    params,
    paramsSerializer: (p) =>
      qs.stringify(p, { encode: false, arrayFormat: "brackets" }),
  });

const walletConnectApiHandler = (params) => {
  return axios.get("auth/wallet_callback", {
    params,
  });
};

const meApi = () => axios.get("auth/me");

export {
  loginApiHandler,
  logoutApiHandler,
  signUpApiHandler,
  signUpWeb3ApiHandler,
  refetchTokenApiHandler,
  meApi,
  walletAuthMessageToSign,
  walletConnectApiHandler,
};
