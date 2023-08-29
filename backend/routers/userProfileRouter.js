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

    return router;
  }
}

module.exports = UserProfileRouter;
