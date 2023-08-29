const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  try {
    // .split breaks them into an array
    const accessToken = req.headers.authorization.split(" ")[1];
    console.log("Access Token:", accessToken);

    if (!accessToken) {
      return res.status(401).json({
        error: true,
        msg: "Error: missing or invalid access token.",
      });
    }

    const user = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = user;
    console.log("user", user);
    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      msg: "Error: unauthorised access, invalid token.",
    });
  }
};

module.exports = jwtAuth;
