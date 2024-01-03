import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const handleLogin = async (req, res) => {
  const users = await User.find();
  const foundUser = users.find((user) => user.email === req.email);
  if (!foundUser) return res.sendStatus(401);

  res.send(foundUser);
};

const handleMetamaskLogin = async (req, res) => {
  const { account, chain_id } = req.query;

  res.json(JSON.stringify({ account, chain_id }));
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

  console.log("foundUser", foundUser);

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

    // res.json({ accessToken });
    res.status(200).send({ message: "Refreshed successfully" });
  });
};

const handleMeApi = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findByRefreshToken(refreshToken);

  if (foundUser.length === 0) return res.sendStatus(403);

  const user = foundUser[0];

  res.status(200).send({ user: user });
};

export {
  handleLogin,
  handleSignUp,
  handleRefreshToken,
  handleMeApi,
  handleLogout,
  handleMetamaskLogin,
};
