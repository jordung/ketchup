const BaseController = require("./baseController");

class UserProfileController extends BaseController {
  constructor({ user, organisation, ticket, document, watcher }) {
    super(user);
    this.user = user;
    this.organisation = organisation;
    this.ticket = ticket;
    this.document = document;
    this.watcher = watcher;
  }

  // =================== GET USER PROFILE =================== //
  getOneUser = async (req, res) => {
    const { userId } = req.params;

    try {
      // display user information + watching list
      const user = await this.model.findByPk(userId, {
        include: [
          {
            model: this.organisation,
            attributes: ["id", "name"],
          },
        ],
      });

      const userWatchlist = await this.watcher.findAll({
        where: { userId },
        include: [
          { model: this.ticket, attributes: ["id", "name"] },
          { model: this.document, attributes: ["id", "name"] },
        ],
        attributes: ["userId", "ticketId", "documentId"],
        order: [["id", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        data: { user, userWatchlist },
        msg: "Success: Retrieved user information!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  //TODO: slack integration
  // =================== UPDATE USER PROFILE =================== //
  updateProfilePicture = async (req, res) => {
    const { userId } = req.params;
    const {
      control,
      profilePicture,
      firstName,
      lastName,
      slackUserId,
      slackAccessToken,
    } = req.body;

    try {
      if (control === 1) {
        // update user model to integrate with slack

        await this.model.update(
          {
            slackUserId: slackUserId,
            slackAccessToken: slackAccessToken,
          },
          { where: { id: userId } }
        );

        const updatedUser = await this.model.findByPk(userId, {
          include: [
            {
              model: this.organisation,
              attributes: ["id", "name"],
            },
          ],
        });

        const userWatchlist = await this.watcher.findAll({
          where: { userId },
          include: [
            { model: this.ticket, attributes: ["id", "name"] },
            { model: this.document, attributes: ["id", "name"] },
          ],
          attributes: ["userId", "ticketId", "documentId"],
          order: [["id", "DESC"]],
        });

        return res.status(200).json({
          success: true,
          data: { updatedUser, userWatchlist },
          msg: "Success: BUT Slack integration is not ready yet!!!!", //TODO
        });
      } else if (control === 2) {
        // 2 = update user information
        await this.model.update(
          {
            firstName: firstName,
            lastName: lastName,
            profilePicture: profilePicture,
          },
          { where: { id: userId } }
        );

        const updatedUser = await this.model.findByPk(userId, {
          include: [
            {
              model: this.organisation,
              attributes: ["id", "name"],
            },
          ],
        });

        const userWatchlist = await this.watcher.findAll({
          where: { userId },
          include: [
            { model: this.ticket, attributes: ["id", "name"] },
            { model: this.document, attributes: ["id", "name"] },
          ],
          attributes: ["userId", "ticketId", "documentId"],
          order: [["id", "DESC"]],
        });

        return res.status(200).json({
          success: true,
          data: { updatedUser, userWatchlist },
          msg: "Success: Your profile has been updated!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };
}

module.exports = UserProfileController;
