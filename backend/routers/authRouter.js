const express = require("express");
const router = express.Router();

class AuthRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // use POST when there's change of state (e.g. from authenticated to unauthenticated)
    router.post("/signup", this.controller.signUp);
    router.post("/organisation", this.controller.joinOrCreateOrganisation);

    router.post("/login", this.controller.login);
    router.post("/logout", this.controller.logout);
    router.post("/refresh", this.controller.renewAccessToken);

    return router;
  }
}

module.exports = AuthRouter;
