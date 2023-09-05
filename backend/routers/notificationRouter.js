const express = require("express");
const router = express.Router();

class NotificationRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:userId", this.controller.getAllNotification);
    return router;
  }
}

module.exports = NotificationRouter;
