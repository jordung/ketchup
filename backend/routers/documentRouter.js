const express = require("express");
const router = express.Router();

class DocumentRouter {
  constructor(controller, jwtAuth) {
    this.controller = controller;
    this.jwtAuth = jwtAuth;
  }
  routes() {
    router.get("/:organisationId", this.controller.getAllDocuments);
    router.get("/view/:documentId", this.controller.getOneDocument);
    router.post("/view/:documentId", this.controller.updateDocument);
    router.post("/", this.controller.addOneDocument);
    router.delete("/:documentId", this.controller.deleteOneDocument);
    return router;
  }
}

module.exports = DocumentRouter;
