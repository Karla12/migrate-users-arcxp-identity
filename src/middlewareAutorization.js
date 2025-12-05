import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config({ path: process.cwd() + "/.env" });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).sent({ error: "No token provided." });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ error: "Invalid token." });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
