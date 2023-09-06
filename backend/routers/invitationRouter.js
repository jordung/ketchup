const express = require("express");
const router = express.Router();

class InvitationRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.post("/", this.controller.inviteUsers); //TODO
    router.get("/", this.controller.getOrganissation);

    // FOR TESTING ONLY
    router.post("/:userId", this.controller.removeInvitation);
    return router;
  }
}

module.exports = InvitationRouter;
