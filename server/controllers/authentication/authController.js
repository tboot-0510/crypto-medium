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

const handleGoogleAuth = async (req, res) => {
  const { id_token, access_token } = await getUserFromCode(req.query.code);

  const user = await userDetails(access_token, id_token);
  console.log("user", user);
  let foundUser = await User.findByEmail(user.email);
  console.log("foudnUser", foundUser);
  if (foundUser.length == 0) {
    const newUser = new User({
      email: email,
      username: username,
      // name: name,
      authenticationToken: "created",
    });

    foundUser = await newUser.save();
  }

  const { accessToken, refreshToken } = generateCookies({
    currenUserId: foundUser._id,
  });

  foundUser.authenticationToken = refreshToken;
  await foundUser.save();

  sendCookies(res, accessToken, refreshToken);

  res.redirect(
    `${env.CLIENT_URL}/oauth/redirect?uid=${foundUser._id}&access_token=${accessToken}&refresh_token=${refreshToken}`
  );
};

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

async function getUserFromCode(code) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: env.clientid,
    client_secret: env.clientsecret,
    redirect_uri: env.redirect_url,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

async function userDetails(access_token, id_token) {
  return axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
    });
}

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
  handleGoogleAuth,
};
