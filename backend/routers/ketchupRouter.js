const express = require("express");
const router = express.Router();

class KetchupRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    // this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/", this.controller.getDailyKetchups);
    return router;
  }
}

module.exports = KetchupRouter;
