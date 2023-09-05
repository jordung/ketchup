const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index");

class TicketController extends BaseController {
  constructor({
    user,
    organisation,
    tag,
    priority,
    status,
    ticket,
    ticket_dependency,
    document,
    document_ticket,
    watcher,
    post,
    agenda,
    update,
    notification,
  }) {
    super(ticket);
    this.user = user;
    this.organisation = organisation;
    this.tag = tag;
    this.priority = priority;
    this.status = status;
    this.ticket = ticket;
    this.ticket_dependency = ticket_dependency;
    this.document = document;
    this.document_ticket = document_ticket;
    this.watcher = watcher;
    this.post = post;
    this.agenda = agenda;
    this.update = update;
    this.notification = notification;
  }

  // =================== GET ALL TICKETS =================== //
  getAllTickets = async (req, res) => {
    const { organisationId } = req.params;

    try {
      const allTickets = await this.model.findAll({
        where: { organisationId: organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.user,
            as: "assignee",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.priority,
            attributes: ["id", "name"],
          },
          {
            model: this.status,
            attributes: ["id", "name"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.ticket_dependency,
            attributes: ["dependencyId"],
            include: [{ model: this.model, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId: organisationId },
        attributes: [
          "id",
          "firstName",
          "lastName",
          "lastName",
          "profilePicture",
        ],
      });

      return res.status(200).json({
        success: true,
        data: { allTickets, allTags, allUsers },
        msg: "Success: All tickets retrieved!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== GET ONE TICKET =================== //
  getOneTicket = async (req, res) => {
    const { ticketId } = req.params;
    try {
      const ticket = await this.model.findByPk(ticketId, {
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.user,
            as: "assignee",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.priority,
            attributes: ["id", "name"],
          },
          {
            model: this.status,
            attributes: ["id", "name"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.ticket_dependency,
            attributes: ["dependencyId"],
            include: [{ model: this.model, attributes: ["id", "name"] }],
          },
        ],
      });

      const allTickets = await this.model.findAll({
        where: { organisationId: ticket.organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.user,
            as: "assignee",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.priority,
            attributes: ["id", "name"],
          },
          {
            model: this.status,
            attributes: ["id", "name"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.ticket_dependency,
            attributes: ["dependencyId"],
            include: [{ model: this.model, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId: ticket.organisationId },
        attributes: ["id", "name"],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId: ticket.organisationId },
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
        where: { ticketId: ticketId },
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
        attributes: ["id", "ticketId"],
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        success: true,
        data: { ticket, allTickets, allTags, allUsers, allWatchers },
        msg: "Success: Ticket retrieved successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== ADD NEW TAG =================== //
  addNewTag = async (req, res) => {
    const { organisationId, name } = req.body;

    if (!organisationId || !name) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please fill in all required fields and try again.",
      });
    }

    try {
      const nameToLowerCase = name.toLowerCase();

      let formattedName;
      formattedName = nameToLowerCase.startsWith("#")
        ? nameToLowerCase
        : `#${nameToLowerCase}`;

      const existingTag = await this.tag.findOne({
        where: { name: formattedName },
      });

      if (existingTag) {
        return res.status(409).json({
          error: true,
          msg: `Error: Tag "${formattedName} already exists`,
        });
      } else {
        await this.tag.create({
          organisationId: organisationId,
          name: formattedName,
        });
      }
      const allTags = await this.tag.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      return res.status(200).json({
        success: true,
        data: allTags,
        msg: `Success: "${formattedName}" tag has been added!`,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== ADD ONE TICKET =================== //
  // Note: organisationId, creatorId, ticket name cannot be null.
  addOneTicket = async (req, res) => {
    const {
      organisationId,
      creatorId,
      assigneeId,
      tagId,
      priorityId,
      name,
      body,
      dueDate,
      dependencyId,
    } = req.body;

    if (!organisationId || !creatorId || !name) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please fill in all required fields and try again.",
      });
    }

    // initialise defaultValue for statusId
    const statusId = 1; // not started

    try {
      // 1. create a new ticket
      const newTicket = await this.model.create({
        organisationId,
        creatorId,
        assigneeId,
        tagId,
        priorityId,
        statusId,
        name,
        body,
        dueDate,
      });

      if (dependencyId) {
        // 2. retrieve the ticketId and create a new entry in ticket_dependencies table
        await this.ticket_dependency.create({
          ticketId: newTicket.id,
          dependencyId,
        });
        // console.log("newTicketid", newTicket.id);
      }

      // 3. add creator and assignee (if any) to watchlist
      if (creatorId) {
        await this.watcher.create({
          userId: creatorId,
          ticketId: newTicket.id,
        });
      }

      if (assigneeId) {
        await this.watcher.create({
          userId: assigneeId,
          ticketId: newTicket.id,
        });

        // retrieve creator's information
        const creator = await this.user.findByPk(creatorId);

        // add assignee to the notification table
        await this.notification.create({
          organisationId: organisationId,
          userId: assigneeId,
          ticketId: newTicket.id,
          type: "ticket",
          message: `${creator.firstName} ${creator.lastName} has assigned you a new ticket.`,
        });
      }

      const allTickets = await this.model.findAll({
        where: { organisationId: organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.user,
            as: "assignee",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.priority,
            attributes: ["id", "name"],
          },
          {
            model: this.status,
            attributes: ["id", "name"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.ticket_dependency,
            attributes: ["dependencyId"],
            include: [{ model: this.model, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId: organisationId },
        attributes: [
          "id",
          "firstName",
          "lastName",
          "lastName",
          "profilePicture",
        ],
      });

      return res.status(200).json({
        success: true,
        data: { allTickets, allTags, allUsers },
        msg: "Success: You've successfully added a new ticket!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== UPDATE TICKET =================== //
  // Note: organisationId and creatorId cannot be changed.
  updateTicket = async (req, res) => {
    const { ticketId } = req.params;
    const {
      assigneeId,
      tagId,
      priorityId,
      statusId,
      name,
      body,
      dueDate,
      dependencyId,
    } = req.body;

    const getTicket = await this.model.findByPk(ticketId);
    const includesName = !name ? getTicket.name : name;

    try {
      await this.model.update(
        {
          assigneeId,
          tagId,
          priorityId,
          statusId,
          name: includesName,
          body,
          dueDate,
        },
        { where: { id: ticketId } }
      );

      // Note: 3 scenarios for when user updates ticket dependency:
      // 1. The ticket currently has NO dependency; user assigns dependencyId for the first time
      // 2. The ticket currently has a dependency; user reassigns the dependencyId
      // 3. The ticket currently has a dependency; user removes dependencyId (= null)

      const updatedTicket = await this.model.findByPk(ticketId, {
        include: [{ model: this.ticket_dependency, attributes: ["id"] }],
      });
      // console.log("updatedTicket", updatedTicket);

      // use .some() to get boolean and prevent the code from erroring out if 'id' is not found
      const hasDependency = updatedTicket.ticket_dependencies.some(
        (dependency) => dependency.dataValues.id !== null
      );
      // console.log("hasDependency", hasDependency);

      if (dependencyId !== null && !hasDependency) {
        // console.log("first scenario");
        await this.ticket_dependency.create({
          ticketId,
          dependencyId,
        });
      } else if (dependencyId !== null && hasDependency) {
        // console.log("second scenario");
        await this.ticket_dependency.update(
          { dependencyId },
          { where: { ticketId } }
        );
      } else if (dependencyId === null && hasDependency) {
        // console.log("third scenario");
        await this.ticket_dependency.destroy({
          where: { id: updatedTicket.ticket_dependencies[0].dataValues.id },
        });
      }
      //TODO: check ^

      const ticket = await this.model.findByPk(ticketId, {
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.user,
            as: "assignee",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.priority,
            attributes: ["id", "name"],
          },
          {
            model: this.status,
            attributes: ["id", "name"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.ticket_dependency,
            attributes: ["dependencyId"],
            include: [{ model: this.model, attributes: ["id", "name"] }],
          },
        ],
      });

      const allTickets = await this.model.findAll({
        where: { organisationId: ticket.organisationId },
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.user,
            as: "assignee",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
          },
          {
            model: this.priority,
            attributes: ["id", "name"],
          },
          {
            model: this.status,
            attributes: ["id", "name"],
          },
          {
            model: this.tag,
            attributes: ["id", "name"],
          },
          {
            model: this.ticket_dependency,
            attributes: ["dependencyId"],
            include: [{ model: this.model, attributes: ["id", "name"] }],
          },
        ],
        order: [["id", "DESC"]],
      });

      const allTags = await this.tag.findAll({
        where: { organisationId: ticket.organisationId },
        attributes: ["id", "name"],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId: ticket.organisationId },
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
        where: { ticketId: ticketId },
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
        attributes: ["id", "ticketId", "userId"],
        order: [["id", "ASC"]],
      });

      // notify all ticket watchers
      for (const watcher of allWatchers) {
        const userId = watcher.dataValues.userId;
        try {
          await this.notification.create({
            organisationId: ticket.organisationId,
            userId,
            type: "ticket",
            message: `${ticket.name} has been updated.`,
          });
        } catch (error) {
          console.error("Error: Unable to notify all ticket watchers");
        }
      }

      return res.status(200).json({
        success: true,
        data: { ticket, allTickets, allTags, allUsers, allWatchers },
        msg: "Success: Ticket has been updated!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== DELETE ONE TICKET =================== //
  deleteOneTicket = async (req, res) => {
    const { ticketId } = req.params;
    const transaction = await sequelize.transaction();

    try {
      // check if ticket exists
      const ticket = await this.model.findByPk(ticketId, {
        include: [
          {
            model: this.ticket_dependency,
          },
          {
            model: this.document_ticket,
          },
          {
            model: this.watcher,
          },
          {
            model: this.post,
          },
          {
            model: this.agenda,
          },
          {
            model: this.update,
          },
          {
            model: this.notification,
          },
        ],
      });

      if (!ticket) {
        return res.status(404).json({
          error: true,
          msg: "Error: Ticket not found",
        });
      }

      // remove ticket association from ticket_dependency
      const dependencyTicket = await this.ticket_dependency.findOne({
        where: { dependencyId: ticketId },
      });

      if (dependencyTicket) {
        await this.ticket_dependency.destroy({
          where: { dependencyId: ticketId },
        });
      }

      // remove ticket from all users' watching lists
      const hasWatcher = ticket.watchers.some(
        (user) => user.dataValues.id !== null
      );

      if (hasWatcher) {
        await this.watcher.destroy({
          where: { ticketId },
        });
      }

      // remove ticket from all users' watching lists
      const hasDocument = ticket.document_tickets.some(
        (document) => document.dataValues.id !== null
      );

      if (hasDocument) {
        await this.document_ticket.destroy({
          where: { ticketId },
        });
      }

      // remove ticket association from agenda
      const hasAgenda = ticket.agendas.some(
        (agenda) => agenda.dataValues.id !== null
      );

      if (hasAgenda) {
        await this.agenda.update(
          {
            ticketId: null,
          },
          { where: { ticketId } }
        );
      }

      // remove ticket association from update
      const hasUpdates = ticket.updates.some(
        (update) => update.dataValues.id !== null
      );

      if (hasUpdates) {
        await this.update.update(
          {
            ticketId: null,
          },
          { where: { ticketId } }
        );
      }

      const hasPosts = ticket.posts.some((post) => post.dataValues.id !== null);

      if (hasPosts) {
        await this.post.update(
          {
            ticketId: null,
          },
          { where: { ticketId } }
        );
      }

      // remove ticket from notifications
      const hasNotifications = ticket.notifications.some(
        (notification) => notification.dataValues.id !== null
      );

      if (hasNotifications) {
        await this.notification.destroy({
          where: { ticketId },
        });
      }

      await this.model.destroy({
        where: { id: ticketId },
      });

      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Success: Ticket has been deleted!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };
}

module.exports = TicketController;
