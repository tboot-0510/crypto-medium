import User from "../models/user.js";
import bcrypt from "bcrypt";

const handleLogin = async (req, res) => {
  const users = await User.find();
  const foundUser = users.find((user) => user.email === req.email);
  if (!foundUser) return res.sendStatus(401);

  console.log("users", users);

  // const result = await newUser.save();
  res.send(foundUser);
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
    });

    const result = await newUser.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { handleLogin, handleSignUp };
