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
    router.post("/document", this.controller.addDocumentToWatchlist);
    router.delete("/document", this.controller.stopWatchingDocument);

    // for testing purposes
    router.get("/tickets/:organisationId", this.controller.allTicketsWatchers);
    router.get(
      "/documents/:organisationId",
      this.controller.allDocumentsWatchers
    );
    return router;
  }
}

module.exports = WatchlistRouter;
