import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  handleSignUpWeb3,
  handleMetamaskSignIn,
  handleMetamaskSignUp,
  getMessageToSign,
} from "./web3/web3authentication.js";
import { generateCookies, sendCookies } from "../cookies/generateCookies.js";
import { errorWithStatusCode } from "../../middelware/error_handler.js";

const handleLogin = async (req, res) => {
  const users = await User.find();
  const foundUser = users.find((user) => user.email === req.email);
  if (!foundUser) return res.sendStatus(401);

  res.send(foundUser);
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

    const { accessToken, refreshToken } = generateCookies({
      currenUserId: newUser._id,
    });

    newUser.authenticationToken = refreshToken;
    await newUser.save();

    sendCookies(res, accessToken, refreshToken);
    return { user: result };
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("refresh cookies", cookies);
  if (!cookies?.jwt) throw errorWithStatusCode(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findByRefreshToken(refreshToken);

  console.log("foundUser", foundUser);

  if (foundUser.length === 0) throw errorWithStatusCode(403);

  const user = foundUser[0];

  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || user._id.toString() !== decoded.userId)
        throw errorWithStatusCode(403);

      const { accessToken } = generateCookies({ currenUserId: user._id });

      sendCookies(res, accessToken);

      return { message: "Refreshed successfully" };
    }
  );
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
