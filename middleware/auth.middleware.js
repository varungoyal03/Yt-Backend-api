import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      return res.status(401).json({ error: "No token is provided" });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decodedUser;
    next();
  } catch (error) {
    res
      .status(400)
      .json({ error: "something went wrong", message: error.message });
  }
};
