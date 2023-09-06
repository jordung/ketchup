const express = require("express");
const router = express.Router();

class AdminRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:organisationId", this.controller.getOrganisation);
    router.put(
      "/:organisationId",
      this.jwtAuth,
      this.controller.updateOrganisationTiming
    );
    router.post("/", this.controller.updateMemberStatus); //TODO
    return router;
  }
}

module.exports = AdminRouter;
