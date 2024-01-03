import jwt from "jsonwebtoken";
import "dotenv/config";

const isAuthenticated = (req, res, next) => {
  const { accessToken, jwt: jwtToken } = req.cookies;
  if (!accessToken && !jwtToken) return res.sendStatus(401);

  if (!accessToken) return res.status(403).send({ message: "Token expired" });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Token expired" });
    req.userId = decoded.userId;
    next();
  });
};

export default isAuthenticated;
