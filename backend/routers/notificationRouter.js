const express = require("express");
const router = express.Router();

class NotificationRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/:userId", this.controller.getAllNotification);
    return router;
  }
}

module.exports = NotificationRouter;
