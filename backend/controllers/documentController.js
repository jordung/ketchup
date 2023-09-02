const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index");

class DocumentController extends BaseController {
  constructor({
    user,
    organisation,
    tag,
    ticket,
    document,
    document_ticket,
    watcher,
  }) {
    super(document);
    this.user = user;
    this.organisation = organisation;
    this.tag = tag;
    this.ticket = ticket;
    this.document = document;
    this.document_ticket = document_ticket;
    this.watcher = watcher;
  }

  // =================== GET ALL DOCUMENTS =================== //
  getAllDocuments = async (req, res) => {
    const { organisationId } = req.params;

    try {
      const allDocuments = await this.model.findAll({
        where: { organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.document_ticket,
            attributes: ["id", "ticketId", "documentId"],
            include: [{ model: this.ticket, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      const allTickets = await this.ticket.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      return res.status(200).json({
        success: true,
        data: { allDocuments, allTags, allTickets },
        msg: "Success: All documents retrieved!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== GET ONE DOCUMENT =================== //
  getOneDocument = async (req, res) => {
    const { documentId } = req.params;

    try {
      const document = await this.model.findByPk(documentId, {
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.document_ticket,
            attributes: ["id", "ticketId", "documentId"],
            include: [{ model: this.ticket, attributes: ["id", "name"] }],
          },
        ],
      });

      const allDocuments = await this.model.findAll({
        where: { organisationId: document.organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.document_ticket,
            attributes: ["id", "ticketId", "documentId"],
            include: [{ model: this.ticket, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId: document.organisationId },
        attributes: ["id", "name"],
      });

      const allTickets = await this.ticket.findAll({
        where: { organisationId: document.organisationId },
        attributes: ["id", "name"],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId: document.organisationId },
        attributes: [
          "id",
          "firstName",
          "lastName",
          "lastName",
          "profilePicture",
        ],
        order: [["id", "ASC"]],
      });

      const allWatchers = await this.watcher.findAll({
        where: { documentId },
        include: [
          {
            model: this.user,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "lastName",
              "profilePicture",
            ],
          },
        ],
        attributes: ["id", "documentId"],
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        success: true,
        data: {
          document,
          allDocuments,
          allTags,
          allTickets,
          allUsers,
          allWatchers,
        },
        msg: "Success: Document retrieved successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== ADD ONE DOCUMENT =================== //
  // Note: organisationId, creatorId, document name cannot be null.
  addOneDocument = async (req, res) => {
    const { organisationId, creatorId, tagId, name, body, ticketId } = req.body;

    if (!organisationId || !creatorId || !name) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please fill in all required fields and try again.",
      });
    }

    try {
      // 1. create a new document
      const newDocument = await this.model.create({
        organisationId,
        userId: creatorId,
        tagId,
        name,
        body,
      });

      if (ticketId) {
        // 2. retrieve the documentId and create a new entry in document_tickets table
        await this.document_ticket.create({
          documentId: newDocument.id,
          ticketId,
        });
      }

      // 3. add creator to watchlist
      await this.watcher.create({
        userId: creatorId,
        documentId: newDocument.id,
      });

      const allDocuments = await this.model.findAll({
        where: { organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.document_ticket,
            attributes: ["id", "ticketId", "documentId"],
            include: [{ model: this.ticket, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      const allTickets = await this.ticket.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId },
        attributes: [
          "id",
          "firstName",
          "lastName",
          "lastName",
          "profilePicture",
        ],
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        success: true,
        data: { allDocuments, allTags, allTickets, allUsers },
        msg: "Success: You've successfully added a new document!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== UPDATE DOCUMENT =================== //
  // Note: organisationId and creatorId cannot be changed.

  updateDocument = async (req, res) => {
    const { documentId } = req.params;
    const { tagId, name, body, ticketId } = req.body;

    const getDocument = await this.model.findByPk(documentId);
    // console.log("getDocument", getDocument);
    // console.log("getDocument.name", getDocument.name);

    const includesName = !name ? getDocument.name : name;
    // console.log("includesName", includesName);

    try {
      await this.model.update(
        {
          tagId,
          name: includesName,
          body,
        },
        { where: { id: documentId } }
      );

      // Note: 3 scenarios for when user updates the ticket tagged to the document:
      // 1. The document currently has NO ticket tagged to it; user assigns ticketId for the first time.
      // 2. The document currently has a ticket tagged to it; user reassigns the tickedId.
      // 3. The ticket currently has a ticket tagged to it; user removes the ticketId.

      const updatedDocument = await this.model.findByPk(documentId, {
        include: [{ model: this.document_ticket, attributes: ["id"] }],
      });

      const hasTaggedTicket = updatedDocument.document_tickets.some(
        (ticket) => ticket.dataValues.id !== null
      );

      if (ticketId !== null && !hasTaggedTicket) {
        // console.log("first scenario");
        await this.document_ticket.create({ ticketId, documentId });
      } else if (ticketId !== null && hasTaggedTicket) {
        // console.log("second scenario");
        await this.document_ticket.update(
          { ticketId },
          { where: { documentId } }
        );
      } else if (ticketId === null && hasTaggedTicket) {
        // console.log("third scenario");
        await this.document_ticket.destroy({
          where: { id: updatedDocument.document_tickets[0].dataValues.id },
        });
      }

      const document = await this.model.findByPk(documentId, {
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.document_ticket,
            attributes: ["id", "ticketId", "documentId"],
            include: [{ model: this.ticket, attributes: ["id", "name"] }],
          },
        ],
      });

      const allDocuments = await this.model.findAll({
        where: { organisationId: document.organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.document_ticket,
            attributes: ["id", "ticketId", "documentId"],
            include: [{ model: this.ticket, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId: document.organisationId },
        attributes: ["id", "name"],
      });

      const allTickets = await this.ticket.findAll({
        where: { organisationId: document.organisationId },
        attributes: ["id", "name"],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId: document.organisationId },
        attributes: [
          "id",
          "firstName",
          "lastName",
          "lastName",
          "profilePicture",
        ],
        order: [["id", "ASC"]],
      });

      const allWatchers = await this.watcher.findAll({
        where: { documentId },
        include: [
          {
            model: this.user,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "lastName",
              "profilePicture",
            ],
          },
        ],
        attributes: ["id", "documentId"],
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        success: true,
        data: {
          document,
          allDocuments,
          allTags,
          allTickets,
          allUsers,
          allWatchers,
        },
        msg: "Success: Document has been updated!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== DELETE ONE TICKET =================== //
  deleteOneDocument = async (req, res) => {
    const { documentId } = req.params;
    const transaction = await sequelize.transaction();

    try {
      // check if document exists
      const document = await this.model.findByPk(documentId, {
        include: [
          {
            model: this.document_ticket,
          },
          {
            model: this.watcher,
          },
        ],
      });

      if (!document) {
        return res.status(404).json({
          error: true,
          msg: "Error: Document not found",
        });
      }

      // remove document from all users' watching lists
      const hasWatcher = document.watchers.some(
        (user) => user.dataValues.id !== null
      );

      if (hasWatcher) {
        await this.watcher.destroy({
          where: { documentId },
        });
      }

      const hasRelatedTicket = document.document_tickets.some(
        (ticket) => ticket.dataValues.id !== null
      );

      if (hasRelatedTicket) {
        await this.document_ticket.destroy({
          where: { documentId },
        });
      }

      await this.model.destroy({
        where: { id: documentId },
      });

      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Success: Document has been deleted!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };
}

module.exports = DocumentController;
