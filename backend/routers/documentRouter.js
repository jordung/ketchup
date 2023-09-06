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
    router.post(
      "/view/:documentId",
      this.jwtAuth,
      this.controller.updateDocument
    );
    router.post("/", this.jwtAuth, this.controller.addOneDocument);
    router.delete(
      "/:documentId",
      this.jwtAuth,
      this.controller.deleteOneDocument
    );
    return router;
  }
}

module.exports = DocumentRouter;
