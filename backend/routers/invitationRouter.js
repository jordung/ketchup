const express = require("express");
const router = express.Router();

class InvitationRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    // this.jwtAuth = jwtAuth;
  }
  routes() {
    router.post("/", this.controller.inviteUsers);
    router.get("/id", this.controller.getOrganissation);
    return router;
  }
}

module.exports = InvitationRouter;
