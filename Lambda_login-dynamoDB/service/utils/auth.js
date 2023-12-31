const jwt = require("jsonwebtoken");

const EXPIRATION = process.env.EXPIRATION ;

exports.generateToken = (userInfo) => {
  if (!userInfo) {
    return null;
  }

  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: EXPIRATION,
  });
};

exports.verifyToken = (username, token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
    if (error) {
      return {
        verified: false,
        message: "Invalid token",
        error: error,
      };
    }

    if (response.username !== username) {
      return {
        verified: false,
        message: "Invalid user",
      };
    }

    return {
      verified: true,
      message: "verified",
    };
  });
};