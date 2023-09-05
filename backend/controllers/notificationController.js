const BaseController = require("./baseController");

class NotificationController extends BaseController {
  constructor({ user, organisation, ticket, document, notification }) {
    super(notification);
    this.user = user;
    this.organisation = organisation;
    this.ticket = ticket;
    this.document = document;
    this.notification = notification;
  }

  // ALL FOR THE USER IN ONE, SORTED BY TIME (userId)
  // =================== GET NOTIFICATIONS =================== //
  getAllNotification = async (req, res) => {
    const { userId } = req.params;

    try {
      const allNotifications = await this.model.findAll({
        where: { userId },
        attributes: [
          "id",
          "organisationId",
          "userId",
          "ketchupId",
          "ticketId",
          "documentId",
          "type",
          "message",
          "createdAt",
          "updatedAt",
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        success: true,
        data: allNotifications,
        msg: "Success: All notifications retrieved!",
      });
    } catch (error) {
      return res.status(400)({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };
}

module.exports = NotificationController;
