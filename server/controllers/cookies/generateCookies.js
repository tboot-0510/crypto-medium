import jwt from "jsonwebtoken";

const generateCookies = ({ currenUserId }) => {
  const accessToken = jwt.sign(
    {
      userId: currenUserId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "3min" }
  );
  const refreshToken = jwt.sign(
    {
      userId: currenUserId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return { accessToken, refreshToken };
};

const sendCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 3 * 60 * 1000, // 3 minutes
  });

  if (refreshToken) {
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // cookie is not accessible by other JS
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
};

export { generateCookies, sendCookies };
