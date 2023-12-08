const { isAuthenticated } = require("../utils/utils");

const authenticate = async (req, res, next) => {
  const token = req?.headers?.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const auth = await isAuthenticated(token);
  if (auth) {
    next();
  } else {
    res.status(401).json({ message: "Token Expired" });
  }
};

module.exports = { authenticate };
