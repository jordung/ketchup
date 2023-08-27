const express = require("express");
const router = express.Router();

class UserProfileRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/all", this.controller.getAllUsers.bind(this.controller));

    return router;
  }
}

module.exports = UserProfileRouter;
