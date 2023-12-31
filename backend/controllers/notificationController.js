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

  // =================== FOR TESTING ONLY: DELETE PAST NOTIFICATIONS =================== //
  deleteOneNotification = async (req, res) => {
    const { userId, notificationId } = req.body;

    try {
      // console.log("deleting notification now");
      await this.notification.destroy({
        where: { id: notificationId, userId },
      });
      // console.log("ok deleted!");
      return res.status(200).json({
        success: true,
        msg: "Success: Notification deleted!",
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
