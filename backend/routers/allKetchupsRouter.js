const express = require("express");
const router = express.Router();

class AllKetchupsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/:organisationId", this.controller.getAllKetchups);
    return router;
  }
}

module.exports = AllKetchupsRouter;
