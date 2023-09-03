const express = require("express");
const router = express.Router();

class AllKetchupsRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:organisationId", this.controller.getAllKetchups);
    return router;
  }
}

module.exports = AllKetchupsRouter;
