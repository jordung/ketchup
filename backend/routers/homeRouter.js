const express = require("express");
const router = express.Router();

class HomeRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:userId", this.controller.getDailyKetchups);
    router.post("/", this.jwtAuth, this.controller.addOneReaction);
    router.post("/post", this.jwtAuth, this.controller.addNewPost);
    router.delete("/", this.jwtAuth, this.controller.removeOneReaction);
    return router;
  }
}

module.exports = HomeRouter;
