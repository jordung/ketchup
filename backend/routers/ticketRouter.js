const express = require("express");
const router = express.Router();

class TicketRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:organisationId", this.controller.getAllTickets);
    router.get("/view/:ticketId", this.controller.getOneTicket);
    router.post("/", this.jwtAuth, this.controller.addOneTicket);
    router.post("/view/:ticketId", this.jwtAuth, this.controller.updateTicket);
    router.delete("/:ticketId", this.jwtAuth, this.controller.deleteOneTicket);

    router.post("/tag", this.jwtAuth, this.controller.addNewTag);
    return router;
  }
}

module.exports = TicketRouter;
