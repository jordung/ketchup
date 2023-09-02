const express = require("express");
const router = express.Router();

class WatchlistRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.post("/ticket", this.controller.addTicketToWatchlist);
    router.delete("/ticket", this.controller.stopWatchingTicket);

    // for testing purposes
    router.get("/:organisationId", this.controller.allTicketsWatchers);
    return router;
  }
}

module.exports = WatchlistRouter;
