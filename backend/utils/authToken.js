const jwt = require("jsonwebtoken");

const generateAuthToken = (payload, refreshToken = false) => {
  const secretKey = refreshToken
    ? process.env.REFRESH_JWT_SECRET
    : process.env.JWT_SECRET;

  const expiresIn = refreshToken
    ? process.env.REFRESH_JWT_EXPIRES_IN
    : process.env.JWT_EXPIRES_IN;

  return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = generateAuthToken;
