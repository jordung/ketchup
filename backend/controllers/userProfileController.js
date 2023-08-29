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

  // ====== Update Profile Picture ====== //
  getOneUser = async (req, res) => {
    const { userId } = req.params;

    try {
      // display user information + watching list
      const user = await this.model.findByPk(userId, {
        include: [
          {
            model: this.watcher,
            attributes: ["userId"],
            include: [
              {
                model: this.ticket,
                attributes: ["id", "name"],
              },
              {
                model: this.document,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: user,
        msg: "Success: user information retrieved successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to retrieve user information.",
      });
    }
  };

  // ====== Update Profile Picture ====== //
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
        //TODO: slack integration
      }

      // 2 = update user information
      const user = await this.model.update(
        {
          firstName: firstName,
          lastName: lastName,
          profilePicture: profilePicture,
        },
        { where: { id: userId } }
      );

      return res.status(200).json({
        success: true,
        data: user,
        msg: "Success: user logged out successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: logout unsuccessful.",
      });
    }
  };
}

module.exports = UserProfileController;
