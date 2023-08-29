const crypto = require("crypto");

// function to generate a random verification code
const generateEmailToken = () => {
  const token = crypto.randomBytes(32).toString("hex").toUpperCase();
  return token;
};

module.exports = generateEmailToken;
