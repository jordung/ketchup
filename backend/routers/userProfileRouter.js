const express = require("express");
const router = express.Router();

class UserProfileRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/all", this.controller.getAllUsers);
    router.get("/:userId", this.controller.getOneUser);
    router.post("/:userId", this.jwtAuth, this.controller.updateProfilePicture);

    router.get("/slack/oauth/callback", this.controller.slackAuthCallback);

    return router;
  }
}

module.exports = UserProfileRouter;
