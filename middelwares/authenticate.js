const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ message: "Token verification failed" });
    } else {
      req.user = decoded;
      console.log("Decoded JWT:", decoded);
      next(); 
    }
  });
};

module.exports = { authenticate };
