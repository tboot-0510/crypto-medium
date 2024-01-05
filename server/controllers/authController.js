import User from "../models/user.js";
import Wallet from "../models/wallet.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyTypedData } from "ethers";
import { encrypt, decrypt } from "../helpers/encryption.js";
import { errorWithStatusCode } from "../middelware/error_handler.js";

const handleLogin = async (req, res) => {
  const users = await User.find();
  const foundUser = users.find((user) => user.email === req.email);
  if (!foundUser) return res.sendStatus(401);

  res.send(foundUser);
};

const getMessageToSign = async (req) => {
  const { account, chain_id } = req.query;

  const encryptedData = encrypt(
    JSON.stringify({ account: account, chainId: chain_id })
  );

  return {
    message: encryptedData,
  };
};

const handleMetamaskSignIn = async (signatureParams, signature) => {
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

  console.log("savedUser", savedUser[0], foundWallet[0]._id);

  if (savedUser.length === 0)
    throw errorWithStatusCode(500, {
      message: "No user is linked to this account Address",
    });

  return {
    user: savedUser[0],
  };
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

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findByRefreshToken(refreshToken);

  if (foundUser.length === 0) return res.sendStatus(403);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 0,
  });

  res.status(200).send("Logged out successfully");
};

const handleSignUpWeb3 = async (req, res) => {
  const { name, username, account } = req.body?.user;

  if (!name && !username)
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

    const accessToken = jwt.sign(
      {
        userId: currentUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      {
        userId: currentUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    currentUser.authenticationToken = refreshToken;
    const result = await currentUser.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 1000, // 30 seconds
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true, // cookie is not accessible by other JS
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { user: result };
  } catch (err) {
    throw errorWithStatusCode(500, {
      message: err.message,
    });
  }
};

const handleSignUp = async (req, res) => {
  const { name, email, username, password } = req.body?.user;

  if (!username && !password && !email && !name)
    return res.status(400).json({ message: "User params not provided" });

  const foundUser = await User.findByEmail(email);

  if (foundUser.length != 0)
    return res.status(409).json({ message: "User already exists" }); //conflict

  try {
    const hashPwd = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      username: username,
      name: name,
      password: hashPwd,
      authenticationToken: "created",
    });

    const result = await newUser.save();

    const accessToken = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    newUser.authenticationToken = refreshToken;
    await newUser.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 1000, // 30 seconds
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true, // cookie is not accessible by other JS
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).send({ user: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("refresh cookies", cookies);
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findByRefreshToken(refreshToken);

  if (foundUser.length === 0) return res.sendStatus(403);

  const user = foundUser[0];

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.userId)
      return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 1000, // 30 seconds
    });

    return { message: "Refreshed successfully" };
  });
};

const handleMeApi = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findByRefreshToken(refreshToken).populate(
    "walletAccount",
    "externalAccountId"
  );

  if (foundUser.length === 0) return res.sendStatus(403);

  const user = foundUser[0];

  res.status(200).send({ user: user });
};

export {
  handleLogin,
  handleSignUp,
  handleSignUpWeb3,
  handleRefreshToken,
  handleMeApi,
  handleLogout,
  handleMetamaskSignIn,
  handleMetamaskSignUp,
  getMessageToSign,
};
