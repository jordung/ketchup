const express = require("express");
const router = express.Router();

class AdminRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    // this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:organisationId", this.controller.getOrganisation);
    router.put("/:organisationId", this.controller.updateOrganisationTiming);
    router.post("/", this.controller.updateMemberStatus);
    return router;
  }
}

module.exports = AdminRouter;
