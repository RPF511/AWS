const jwt = require("jsonwebtoken");


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

exports.generateQRToken = (userdata) => {
  if (!userdata) {
    return null;
  }
  var userInfo = {
    username : userdata["username"],
    familyname : userdata["familyname"],
    givenname : userdata["givenname"],
    agetype : userdata["agetype"],
    spaland : userdata["spaland"],
    spalanddata : userdata["spalanddata"],
    teamleader : userdata["teamleader"],
    position : userdata["position"],
    nationality : userdata["nationality"]
  } 

  return jwt.sign(userInfo, process.env.JWT_SECRET_QR);
};
