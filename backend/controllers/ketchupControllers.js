const BaseController = require("./baseController");
const { Op } = require("sequelize");

class KetchupController extends BaseController {
  constructor({
    user,
    organisation,
    flag,
    reaction,
    ticket,
    document,
    ketchup,
    ketchup_reaction,
  }) {
    super(ketchup);
    this.user = user;
    this.organisation = organisation;
    this.flag = flag;
    this.reaction = reaction;
    this.ticket = ticket;
    this.document = document;
    this.ketchup = ketchup;
    this.ketchup_reaction = ketchup_reaction;
  }

  // in homepage, display users who has posted ketchups + those that haven't
  // display all ketchups (agenda and update) for that day
  // ketchups to include reactions, tickets, documents, user info + organisation
  // all posts + reactions + tickets

  // ====== Get Daily Ketchups ====== //
  getDailyKetchups = async (req, res) => {
    const { userId } = req.body; //get req.body is diff for FE

    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    try {
      // retrieve user information + organisationId and name
      const user = await this.user.findByPk(userId, {
        include: [
          {
            model: this.organisation,
            attributes: ["id", "name"],
          },
        ],
      });

      // retrieve organisationId to return all daily ketchups for that organisation
      const organisation = user.organisation.id;
      console.log("organisation id", organisation);

      const dailyKetchups = await this.model.findAll(
        {
          include: [
            {
              model: this.user,
              as: "creator",
            },
          ],
        },
        {
          where: {
            organisationId: organisation,
            createdAt: {
              [Op.gte]: currentDate,
              [Op.lt]: nextDate,
            },
          },
        }
      );

      // ? check w jordan if he needs user obj?

      return res.status(200).json({
        success: true,
        data: { user, dailyKetchups },
        msg: "Success: All daily ketchups retrieved!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while retrieving daily ketchups. Please try again.",
      });
    }
  };
}

module.exports = KetchupController;
