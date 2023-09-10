const express = require("express");
const router = express.Router();

class NotificationRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/:userId", this.controller.getAllNotification);

    // FOR TESTING ONLY
    router.delete("/", this.controller.deleteOneNotification);
    return router;
  }
}

module.exports = NotificationRouter;
