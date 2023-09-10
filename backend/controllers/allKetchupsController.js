const BaseController = require("./baseController");
const { Op } = require("sequelize");
const { startDate, endDate } = require("../utils/getDates");
const { getAllReactions } = require("../utils/reactionsCounter");
const moment = require("moment-timezone");

class AllKetchupsController extends BaseController {
  constructor({
    user,
    organisation,
    flag,
    reaction,
    ticket,
    document,
    ketchup,
    ketchup_reaction,
    agenda,
    ketchup_agenda,
    update,
    ketchup_update,
    notification,
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
    this.agenda = agenda;
    this.ketchup_agenda = ketchup_agenda;
    this.update = update;
    this.ketchup_update = ketchup_update;
    this.notification = notification;
  }

  // =================== VIEW ALL KETCHUPS =================== //
  // Note: There are 2 parts to this API:
  // 1. Return today's ketchup
  // 2. Return all ketchups grouped by date

  getAllKetchups = async (req, res) => {
    const { organisationId } = req.params;

    try {
      const dailyKetchups = await this.model.findAll({
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: [
              "id",
              "organisationId",
              "firstName",
              "lastName",
              "email",
              "profilePicture",
              "slackTeamId",
              "slackUserId",
            ],
          },
          {
            model: this.reaction,
            as: "mood",
            attributes: ["id", "icon"],
          },
          {
            model: this.ketchup_agenda,
            attributes: ["id"],
            include: [
              {
                model: this.agenda,
                attributes: ["content"],
                include: [
                  { model: this.ticket, attributes: ["id", "name"] },
                  { model: this.document, attributes: ["id", "name"] },
                  { model: this.flag, attributes: ["id", "name"] },
                ],
              },
            ],
          },
          {
            model: this.ketchup_update,
            attributes: ["id"],
            include: [
              {
                model: this.update,
                attributes: ["content"],
                include: [
                  { model: this.ticket, attributes: ["id", "name"] },
                  { model: this.document, attributes: ["id", "name"] },
                  { model: this.flag, attributes: ["id", "name"] },
                ],
              },
            ],
          },
          {
            model: this.ketchup_reaction,
            separate: true,
            attributes: ["userId", "ketchupId", "reactionId", "createdAt"],
            include: [{ model: this.reaction, attributes: ["icon"] }],
            order: [["id", "DESC"]],
          },
        ],
        where: {
          organisationId,
          createdAt: {
            [Op.gte]: startDate(),
            [Op.lt]: endDate(),
          },
        },
        attributes: ["id", "organisationId", "createdAt", "updatedAt"],
        order: [["id", "DESC"]],
      });

      const allUsers = await this.user.findAll({
        where: { organisationId },
        attributes: [
          "id",
          "organisationId",
          "firstName",
          "lastName",
          "email",
          "profilePicture",
          "slackTeamId",
          "slackUserId",
          "createdAt",
        ],
      });

      // return the list of users who have not posted ketchups
      const usersWithoutKetchups = [];
      allUsers.forEach((user) => {
        const hasKetchup = dailyKetchups.some(
          (ketchup) => ketchup.creator.id === user.id
        );
        if (!hasKetchup) {
          usersWithoutKetchups.push(user);
        }
      });

      const getKetchupReactions = getAllReactions(
        dailyKetchups,
        "ketchup_reactions"
      );

      // ============== GROUP KETCHUPS BY DATE ============== //
      const allKetchups = await this.model.findAll({
        include: [
          {
            model: this.user,
            as: "creator",
            attributes: [
              "id",
              "organisationId",
              "firstName",
              "lastName",
              "email",
              "profilePicture",
              "slackTeamId",
              "slackUserId",
            ],
          },
          {
            model: this.reaction,
            as: "mood",
            attributes: ["id", "icon"],
          },
          {
            model: this.ketchup_agenda,
            attributes: ["id"],
            include: [
              {
                model: this.agenda,
                attributes: ["content"],
                include: [
                  { model: this.ticket, attributes: ["id", "name"] },
                  { model: this.document, attributes: ["id", "name"] },
                  { model: this.flag, attributes: ["id", "name"] },
                ],
              },
            ],
          },
          {
            model: this.ketchup_update,
            attributes: ["id"],
            include: [
              {
                model: this.update,
                attributes: ["content"],
                include: [
                  { model: this.ticket, attributes: ["id", "name"] },
                  { model: this.document, attributes: ["id", "name"] },
                  { model: this.flag, attributes: ["id", "name"] },
                ],
              },
            ],
          },
          {
            model: this.ketchup_reaction,
            separate: true,
            attributes: ["userId", "ketchupId", "reactionId", "createdAt"],
            include: [{ model: this.reaction, attributes: ["icon"] }],
            order: [["id", "DESC"]],
          },
        ],
        where: { organisationId },
        attributes: ["id", "organisationId", "createdAt", "updatedAt"],
        order: [
          ["createdAt", "DESC"],
          [{ model: this.ketchup_agenda }, "id", "ASC"],
        ],
      });

      const getAllKetchupsReactions = getAllReactions(
        allKetchups,
        "ketchup_reactions"
      );

      // initialise accumulator with {}, iterates through each ketchup in 'allKetchups' array and convert createdAt to date string. Check if 'ketchupDate' already exists in accumulator {}, if yes then push ketchup to getKetchupReactions, else, initialise an empty object.
      const today = moment().tz("Asia/Singapore").startOf("day");
      const tomorrow = today.clone().add(1, "days");
      console.log("tomorrow", tomorrow.format());

      const lastThirtyDays = today.clone().subtract(30, "days");

      const groupKetchupsByDate = [];
      let currentDate = lastThirtyDays.clone();

      // initialise an array of objects for each date in the last 30 days
      while (currentDate < tomorrow) {
        const formattedDate = currentDate.toDate();
        groupKetchupsByDate.push({
          date: formattedDate.toDateString(),
          getKetchupReactions: [],
          usersWithoutKetchups: [],
        });
        // increase date by 1
        currentDate.add(1, "days");
      }

      // sort date in array by descending order
      groupKetchupsByDate.sort((a, b) => {
        const oldest = new Date(a.date);
        const newest = new Date(b.date);
        return newest - oldest;
      });

      getAllKetchupsReactions.forEach((ketchup) => {
        const ketchupDate = new Date(
          ketchup.createdAt.getTime() + 8 * 60 * 60 * 1000
        );

        const hasKetchup = groupKetchupsByDate.find(
          (entry) => entry.date === ketchupDate.toDateString()
        );
        if (hasKetchup) {
          hasKetchup.getKetchupReactions.push(ketchup);
        }
      });

      allUsers.forEach((user) => {
        // iterate over the dates and check if user has posted a ketchup for that particular date, .some() will evaluate to true/false
        Object.keys(groupKetchupsByDate).forEach((date) => {
          const ketchupDate = new Date(groupKetchupsByDate[date].date);

          const hasKetchup = groupKetchupsByDate[date].getKetchupReactions.some(
            (ketchup) => ketchup.creator.id === user.id
          );

          const userCreatedAt = new Date(user.dataValues.createdAt);

          if (!hasKetchup && userCreatedAt <= ketchupDate) {
            groupKetchupsByDate[date].usersWithoutKetchups.push(user);
          }
        });
      });
      // console.log("ketchups grouped by date:", groupKetchupsByDate);

      return res.status(200).json({
        success: true,
        data: {
          getKetchupReactions,
          usersWithoutKetchups,
          groupKetchupsByDate,
        },
        msg: "Success: All ketchups retrieved successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while retrieving daily ketchups. Please try again.",
      });
    }
  };
}

module.exports = AllKetchupsController;
