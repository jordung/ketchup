const express = require("express");
const router = express.Router();

class DailyKetchupRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:organisationId", this.controller.getInformation);
    router.post("/", this.controller.addNewKetchup);
    return router;
  }
}

module.exports = DailyKetchupRouter;
