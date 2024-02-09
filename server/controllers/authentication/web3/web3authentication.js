import User from "../../../models/user.js";
import Wallet from "../../../models/wallet.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyTypedData } from "ethers";
import { encrypt, decrypt } from "../../../helpers/encryption.js";
import { errorWithStatusCode } from "../../../middelware/error_handler.js";
import { generateCookies, sendCookies } from "../../cookies/generateCookies.js";

const getMessageToSign = async (req) => {
  const { account, chain_id } = req.query;

  const encryptedData = encrypt(
    JSON.stringify({ account: account, chainId: chain_id })
  );

  return {
    message: encryptedData,
  };
};

const handleMetamaskSignIn = async (signatureParams, signature, res) => {
  const { domain, types, message } = JSON.parse(signatureParams);
  const decryptedState = decrypt(message.state);

  const account = verifyTypedData(
    domain,
    { Message: types.Message },
    message,
    signature
  );

  if (account.toLowerCase() !== decryptedState.account.toLowerCase())
    throw errorWithStatusCode(403, { message: "Account Address differ" });

  const foundWallet = await Wallet.findByExternalAccount(account.toLowerCase());

  if (foundWallet.length === 0)
    throw errorWithStatusCode(403, {
      message: "Account Address has no linked to account",
    });

  const savedUser = await User.findByWalletAccount(foundWallet[0]._id).populate(
    "walletAccount",
    "externalAccountId"
  );

  if (savedUser.length === 0)
    throw errorWithStatusCode(500, {
      message: "No user is linked to this account Address",
    });

  const currentUser = savedUser[0];

  return jwt.verify(
    currentUser.authenticationToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err?.message === "jwt expired") {
        const { accessToken, refreshToken } = generateCookies({
          currenUserId: currentUser._id,
        });

        sendCookies(res, accessToken, refreshToken);

        currentUser.authenticationToken = refreshToken;
        currentUser.save();

        return {
          user: savedUser[0],
        };
      }
      if (err || currentUser._id.toString() !== decoded?.userId)
        return res.sendStatus(403);

      const { accessToken } = generateCookies({
        currenUserId: currentUser._id,
      });

      sendCookies(res, accessToken, currentUser.authenticationToken);

      return {
        user: savedUser[0],
      };
    }
  );
};

const handleMetamaskSignUp = async (signatureParams, signature) => {
  const { domain, types, message } = JSON.parse(signatureParams);
  const decryptedState = decrypt(message.state);

  const account = verifyTypedData(
    domain,
    { Message: types.Message },
    message,
    signature
  );

  if (account.toLowerCase() !== decryptedState.account.toLowerCase())
    throw errorWithStatusCode(403, { message: "Account Address differ" });

  const foundWallet = await Wallet.findByExternalAccount(account.toLowerCase());

  if (foundWallet.length !== 0)
    throw errorWithStatusCode(403, {
      message: "Account Address already linked to account",
    });

  const newWalletAccount = new Wallet({
    externalAccountId: account.toLowerCase(),
  });
  const walletAccount = await newWalletAccount.save();

  const newUser = new User({
    username: account,
    name: account,
    walletAccount: walletAccount._id,
  });

  const savedUser = await newUser.save();

  newWalletAccount.userId = savedUser._id;
  await newWalletAccount.save();

  return { user: { ...savedUser, walletAccount } };
};

const handleSignUpWeb3 = async (req, res) => {
  const { name, username, account } = req.body?.user;

  if (!name && !username && !account)
    throw errorWithStatusCode(400, {
      message: "User params not provided",
    });

  const foundWallet = await Wallet.findByExternalAccount(account.toLowerCase());

  if (foundWallet.length === 0)
    throw errorWithStatusCode(400, {
      message: "Wallet account doesn't exists",
    });

  const foundUser = await User.find({ _id: foundWallet[0].userId }).populate(
    "walletAccount",
    "externalAccountId"
  );

  if (foundUser.length != 0 && foundUser[0].username === username)
    throw errorWithStatusCode(409, {
      message: "User already exists",
    });

  const currentUser = foundUser[0];
  try {
    currentUser.username = username;
    currentUser.name = name;

    await currentUser.save();

    const { accessToken, refreshToken } = generateCookies({
      currenUserId: currentUser._id,
    });

    currentUser.authenticationToken = refreshToken;
    const result = await currentUser.save();

    sendCookies(res, accessToken, refreshToken);

    return { user: result };
  } catch (err) {
    throw errorWithStatusCode(500, {
      message: err.message,
    });
  }
};

export {
  handleSignUpWeb3,
  handleMetamaskSignIn,
  handleMetamaskSignUp,
  getMessageToSign,
};
