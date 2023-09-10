const BaseController = require("./baseController");
const axios = require("axios");

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

  slackAuthCallback = async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const userId = state;
    try {
      const response = await axios.post(
        "https://slack.com/api/oauth.v2.access",
        {
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRETS,
          code,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        }
      );

      await this.model.update(
        {
          slackTeamId: response.data.team.id,
          slackUserId: response.data.authed_user.id,
          slackAccessToken: response.data.access_token,
        },
        {
          where: { id: userId },
        }
      );
      res.redirect(process.env.REDIRECT_HOME);
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== UPDATE USER PROFILE =================== //
  updateProfilePicture = async (req, res) => {
    const { userId } = req.params;
    const { profilePicture, firstName, lastName } = req.body;

    try {
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
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };
}

module.exports = UserProfileController;
