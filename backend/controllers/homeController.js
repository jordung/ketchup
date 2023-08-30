const BaseController = require("./baseController");
const { Op } = require("sequelize");
const { startDate, endDate } = require("../utils/getDates");
const reactionsCounter = require("../utils/reactionsCounter");

class HomeController extends BaseController {
  constructor({
    user,
    organisation,
    flag,
    reaction,
    ticket,
    document,
    post,
    post_reaction,
    ketchup,
    ketchup_reaction,
    agenda,
    ketchup_agenda,
    update,
    ketchup_update,
  }) {
    super(ketchup);
    this.user = user;
    this.organisation = organisation;
    this.flag = flag;
    this.reaction = reaction;
    this.ticket = ticket;
    this.document = document;
    this.post = post;
    this.post_reaction = post_reaction;
    this.ketchup = ketchup;
    this.ketchup_reaction = ketchup_reaction;
    this.agenda = agenda;
    this.ketchup_agenda = ketchup_agenda;
    this.update = update;
    this.ketchup_update = ketchup_update;
  }

  // Calling the 'getDailyKetchups' API will return the following information:
  // 1. All ketchups created by users affiliated with the organisation for that day;
  // 2. All reactions received for those ketchups (includ. the total count for various emojis reacted by different users in response to the ketchup)
  // 3. The list of users who have yet to post their daily ketchups
  // 4. All posts tagged to the organisation, listed from newest to oldest.
  // 5. All reactions received for those posts (includ. the total count for various emojis reacted by different users in response to the post)

  // ====== Get Daily Ketchups ====== //
  getDailyKetchups = async (req, res) => {
    const { userId } = req.params;

    try {
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

      const ketchups = await this.model.findAll({
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
              "slackUserId",
              "slackAccessToken",
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
            model: this.ketchup_reaction,
            attributes: ["userId", "createdAt"],
            include: [
              {
                model: this.reaction,
                attributes: ["icon"],
              },
            ],
          },
        ],
        where: {
          organisationId: organisation,
          createdAt: {
            [Op.gte]: startDate(),
            [Op.lt]: endDate(),
          },
        },
        attributes: ["id", "organisationId", "createdAt", "updatedAt"],
        order: [["id", "DESC"]],
      });

      // fetch all users within the organisation
      const allUsers = await this.user.findAll({
        where: { organisationId: organisation },
        attributes: [
          "id",
          "organisationId",
          "firstName",
          "lastName",
          "email",
          "profilePicture",
          "slackUserId",
          "slackAccessToken",
        ],
      });

      // return the list of users who have not posted ketchups
      const usersWithoutKetchups = [];
      allUsers.forEach((user) => {
        const hasKetchup = ketchups.some(
          (ketchup) => ketchup.creator.id === user.id
        );
        if (!hasKetchup) {
          usersWithoutKetchups.push(user);
        }
      });

      const posts = await this.post.findAll({
        include: [
          {
            model: this.user,
            attributes: [
              "id",
              "organisationId",
              "firstName",
              "lastName",
              "email",
              "profilePicture",
              "slackUserId",
              "slackAccessToken",
            ],
          },
          {
            model: this.ticket,
            attributes: ["id", "name"],
          },
          {
            model: this.post_reaction,
            attributes: ["userId"],
            include: [
              {
                model: this.reaction,
                attributes: ["icon"],
              },
            ],
          },
        ],
        where: {
          organisationId: organisation,
        },
        attributes: ["id", "content", "createdAt"],
        order: [["id", "DESC"]],
      });

      const dailyKetchups = reactionsCounter(ketchups, "ketchup_reactions");
      const allPosts = reactionsCounter(posts, "post_reactions");

      return res.status(200).json({
        success: true,
        data: {
          dailyKetchups,
          usersWithoutKetchups,
          allPosts,
        },
        msg: "Success: All daily ketchups retrieved!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while retrieving daily ketchups. Please try again.",
      });
    }
  };

  // FE send icon and userId and ketchupid and postId
  // control 1 = ketchupId, 2 = postId
  // 1 -> check if icon exists in reaction table, add reaction to ketchup_reaction
  // 2 --> check if icon exists in reaction table, add reaction to post_reaction

  // ====== Add One Reaction ====== //
  addOneReaction = async (req, res) => {
    const { control, userId, ketchupId, postId, icon } = req.body;
    // note: if control = 1, user is reacting to a ketchup | if control = 2, user is reacting to a post

    try {
      const formattedIcon = icon.toUpperCase();
      console.log("formattedicon", formattedIcon);

      const existingIcon = await this.reaction.findOne({
        where: { icon: formattedIcon },
      });
      console.log("existingIcon", existingIcon);

      const user = await this.user.findByPk(userId);

      if (control === 1) {
        // if not existing icon
        if (!existingIcon) {
          const newIcon = await this.reaction.create({ formattedIcon });
          await this.ketchup_reaction.create({
            userId: userId,
            ketchupId: ketchupId,
            reactionId: newIcon.id,
          });
        } else {
          // if existing icon
          await this.ketchup_reaction.create({
            userId: userId,
            ketchupId: ketchupId,
            reactionId: existingIcon.id,
          });
        }

        //debugging
        // const reactions = await this.ketchup_reaction.findAll({
        //   include: [{ model: this.reaction }],
        // });

        // const reactions = await this.ketchup_reaction.findAll({
        //   include: [{ model: this.reaction }],
        // });

        // const groupByKetchup = {};

        // reactions.forEach((reaction) => {
        //   const ketchups = control === 1 ? reaction.ketchupId : reaction.postId;
        //   if (!groupByKetchup[ketchups]) {
        //     groupByKetchup[ketchups] = [];
        //   }

        //   groupByKetchup[ketchups].push(reaction);
        // });

        // const ketchups = await this.model.findAll();

        // // Group reactions for each ketchup/post
        // const ketchupsWithReactions = ketchups.map((ketchup) => {
        //   const ketchupId = ketchup.id;
        //   const ketchupReactions = reactionsByTicket[ketchupId] || [];
        //   return {
        //     ketchup,
        //     reactions: ketchupReactions,
        //   };
        // });

        const ketchups = await this.model.findAll({
          include: [
            {
              model: this.ketchup_reaction,
              attributes: ["userId", "createdAt"],
              include: [
                {
                  model: this.reaction,
                  attributes: ["icon"],
                },
              ],
            },
          ],
          where: {
            organisationId: user.organisationId,
          },
          attributes: ["id", "createdAt"],
          order: [["createdAt", "ASC"]],
        });
        const dailyKetchups = reactionsCounter(ketchups, "ketchup_reactions");

        return res.status(200).json({
          success: true,
          data: dailyKetchups,
          msg: "Success: Reaction added successfully!",
        });
      } else if (control === 2) {
        if (!existingIcon) {
          // if not existing icon
          const newIcon = await this.reaction.create({ icon: formattedIcon });
          await this.post_reaction.create({
            userId: userId,
            postId: postId,
            reactionId: newIcon.id,
          });
        } else {
          // if existing icon
          await this.post_reaction.create({
            userId: userId,
            postId: postId,
            reactionId: existingIcon.id,
          });
        }
        const posts = await this.post.findAll({
          include: [
            {
              model: this.post_reaction,
              attributes: ["userId", "createdAt"],
              include: [
                {
                  model: this.reaction,
                  attributes: ["icon"],
                },
              ],
            },
          ],
          where: {
            organisationId: user.organisationId,
          },
          attributes: ["id", "createdAt"],
          order: [["id", "DESC"]],
        });

        const allPosts = reactionsCounter(posts, "post_reactions");
        return res.status(200).json({
          success: true,
          data: allPosts,
          msg: "Success: Reaction added successfully!",
        });
      } else {
        return res.status(400).json({
          error: true,
          msg: "Error: Invalid request. Please try again.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  addNewPost = async (req, res) => {
    const { userId, organisationId, ticketId, content } = req.body;
    try {
      const newPost = await this.post.create({
        userId,
        organisationId,
        ticketId,
        content,
      });
      console.log("newPost", newPost);

      const posts = await this.post.findAll({
        include: [
          {
            model: this.user,
            attributes: [
              "id",
              "organisationId",
              "firstName",
              "lastName",
              "email",
              "profilePicture",
              "slackUserId",
              "slackAccessToken",
            ],
          },
          {
            model: this.ticket,
            attributes: ["id", "name"],
          },
          {
            model: this.post_reaction,
            attributes: ["userId"],
            include: [
              {
                model: this.reaction,
                attributes: ["icon"],
              },
            ],
          },
        ],
        where: { organisationId },
        attributes: ["id", "content", "createdAt"],
        order: [["id", "DESC"]],
      });

      const allPosts = reactionsCounter(posts, "post_reactions");

      return res.status(200).json({
        success: true,
        data: allPosts,
        msg: "Success: New post added!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: Unable to add new post. Please try again.",
      });
    }
  };
}

module.exports = HomeController;
