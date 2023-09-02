const crypto = require("crypto");

// function to generate a random verification code
const generateEmailToken = () => {
  const token = crypto.randomBytes(6).toString("hex").toUpperCase();
  return token;
};

module.exports = generateEmailToken;
