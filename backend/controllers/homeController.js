const BaseController = require("./baseController");
const { Op } = require("sequelize");
const { startDate, endDate } = require("../utils/getDates");
const { getAllReactions } = require("../utils/reactionsCounter");

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
            separate: true,
            attributes: ["userId", "ketchupId", "reactionId", "createdAt"],
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
        const hasKetchup = dailyKetchups.some(
          (ketchup) => ketchup.creator.id === user.id
        );
        if (!hasKetchup) {
          usersWithoutKetchups.push(user);
        }
      });

      const allPosts = await this.post.findAll({
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
            separate: true,
            attributes: ["userId", "postId", "reactionId", "createdAt"],
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

      const getKetchupReactions = getAllReactions(
        dailyKetchups,
        "ketchup_reactions"
      );
      const getPostReactions = getAllReactions(allPosts, "post_reactions");

      // console.log("getKetchupReactions", getKetchupReactions);
      // console.log("getPostReactions", getPostReactions);

      return res.status(200).json({
        success: true,
        data: {
          getKetchupReactions,
          usersWithoutKetchups,
          getPostReactions,
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

  // 3 scenarios: (1) user reacted w a new emoji, (2) user reacted w an existing emoji for the first time, and (3) user reacted w an existing emoji for the second time - no new entry will be added to database.

  // ====== Add One Reaction ====== //
  addOneReaction = async (req, res) => {
    const { control, userId, ketchupId, postId, icon } = req.body;
    // note: if control = 1, user is reacting to a ketchup | if control = 2, user is reacting to a post

    try {
      const formattedIcon = icon.toUpperCase();
      console.log("formattedIcon", formattedIcon);

      const existingIcon = await this.reaction.findOne({
        where: { icon: formattedIcon },
      });
      console.log("existingIcon", existingIcon);

      const user = await this.user.findByPk(userId);

      if (!existingIcon) {
        await this.reaction.create({ icon: formattedIcon });
        const newIcon = await this.reaction.findOne({
          where: { icon: formattedIcon },
        });
        if (control === 1) {
          await this.ketchup_reaction.create({
            userId: userId,
            ketchupId: ketchupId,
            reactionId: newIcon.id,
          });
        } else {
          await this.post_reaction.create({
            userId: userId,
            postId: postId,
            reactionId: newIcon.id,
          });
        }
      } else {
        if (control === 1) {
          const existingEntry = await this.ketchup_reaction.findOne({
            where: {
              userId: userId,
              ketchupId: ketchupId,
              reactionId: existingIcon.id,
            },
          });
          if (!existingEntry) {
            await this.ketchup_reaction.create({
              userId: userId,
              ketchupId: ketchupId,
              reactionId: existingIcon.id,
            });
          }
        } else {
          const existingEntry = await this.post_reaction.findOne({
            where: {
              userId: userId,
              postId: postId,
              reactionId: existingIcon.id,
            },
          });
          if (!existingEntry) {
            await this.post_reaction.create({
              userId: userId,
              postId: postId,
              reactionId: existingIcon.id,
            });
          }
        }
      }

      const dailyKetchups = await this.model.findAll({
        include: [
          {
            model: this.ketchup_reaction,
            separate: true,
            attributes: ["userId", "ketchupId", "reactionId", "createdAt"],
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
        attributes: ["id", "organisationId", "createdAt", "updatedAt"],
        order: [["id", "DESC"]],
      });

      const getKetchupReactions = getAllReactions(
        dailyKetchups,
        "ketchup_reactions"
      );

      const allPosts = await this.post.findAll({
        include: [
          {
            model: this.post_reaction,
            separate: true,
            attributes: ["userId", "postId", "reactionId", "createdAt"],
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
        attributes: ["id", "content", "createdAt"],
        order: [["id", "DESC"]],
      });

      const getPostReactions = getAllReactions(allPosts, "post_reactions");

      return res.status(200).json({
        success: true,
        data: { getKetchupReactions, getPostReactions },
        msg: "Success: Reaction added successfully!",
      });

      // } else if (control === 2) {
      //   console.log("i am control 2");
      //   const existingEntry = await this.post_reaction.findOne({
      //     where: {
      //       userId: userId,
      //       postId: postId,
      //       reactionId: existingIcon.id,
      //     },
      //   });
      //   if (!existingEntry && !existingIcon) {
      //     const newIcon = await this.reaction.create({ icon: formattedIcon });
      //     await this.post_reaction.create({
      //       userId: userId,
      //       postId: postId,
      //       reactionId: newIcon.id,
      //     });
      //   } else if (!existingEntry && existingIcon) {
      //     await this.post_reaction.create({
      //       userId: userId,
      //       postId: postId,
      //       reactionId: existingIcon.id,
      //     });
      //   }

      // const allPosts = await this.post.findAll({
      //   include: [
      //     {
      //       model: this.post_reaction,
      //       separate: true,
      //       attributes: ["userId", "postId", "reactionId", "createdAt"],
      //       include: [
      //         {
      //           model: this.reaction,
      //           attributes: ["icon"],
      //         },
      //       ],
      //     },
      //   ],
      //   where: {
      //     organisationId: user.organisationId,
      //   },
      //   attributes: ["id", "content", "createdAt"],
      //   order: [["id", "DESC"]],
      // });

      // const getPostReactions = getAllReactions(allPosts, "post_reactions");

      // return res.status(200).json({
      //   success: true,
      //   data: getPostReactions,
      //   msg: "Success: Reaction added successfully!",
      // });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // ====== Remove One Reaction ====== //
  removeOneReaction = async (req, res) => {
    const { control, userId, ketchupId, postId, icon } = req.body;
    // note: if control = 1 (remove from ketchup) | if control = 2, (remove from post)

    try {
      const formattedIcon = icon.toUpperCase();

      const findReaction = await this.reaction.findOne({
        where: { icon: formattedIcon },
      });

      const user = await this.user.findByPk(userId);

      if (control === 1) {
        await this.ketchup_reaction.destroy({
          where: {
            userId: userId,
            ketchupId: ketchupId,
            reactionId: findReaction.id,
          },
        });

        const dailyKetchups = await this.model.findAll({
          include: [
            {
              model: this.ketchup_reaction,
              separate: true,
              attributes: ["userId", "ketchupId", "reactionId", "createdAt"],
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
          attributes: ["id", "organisationId", "createdAt", "updatedAt"],
          order: [["id", "DESC"]],
        });

        const getKetchupReactions = getAllReactions(
          dailyKetchups,
          "ketchup_reactions"
        );

        return res.status(200).json({
          success: true,
          data: getKetchupReactions,
          msg: "Success: Reaction removed successfully!",
        });
      } else if (control === 2) {
        const findReaction = await this.reaction.findOne({
          where: { icon: formattedIcon },
        });

        await this.post_reaction.destroy({
          where: {
            userId: userId,
            postId: postId,
            reactionId: findReaction.id,
          },
        });

        const allPosts = await this.post.findAll({
          include: [
            {
              model: this.post_reaction,
              separate: true,
              attributes: ["userId", "postId", "reactionId", "createdAt"],
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
          attributes: ["id", "content", "createdAt"],
          order: [["id", "DESC"]],
        });

        const getPostReactions = getAllReactions(allPosts, "post_reactions");

        return res.status(200).json({
          success: true,
          data: getPostReactions,
          msg: "Success: Reaction removed successfully!",
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
      await this.post.create({
        userId,
        organisationId,
        ticketId,
        content,
      });

      const allPosts = await this.post.findAll({
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
            separate: true,
            attributes: ["userId", "postId", "reactionId", "createdAt"],
            include: [
              {
                model: this.reaction,
                attributes: ["icon"],
              },
            ],
          },
        ],
        where: {
          organisationId: organisationId,
        },
        attributes: ["id", "content", "createdAt"],
        order: [["id", "DESC"]],
      });

      const getPostReactions = getAllReactions(allPosts, "post_reactions");

      return res.status(200).json({
        success: true,
        data: getPostReactions,
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

// else {
//   if (control === 1) {
//     const existingEntry = await this.ketchup_reaction.findOne({
//       where: {
//         userId: userId,
//         ketchupId: ketchupId,
//         reactionId: existingIcon.id,
//       },
//     });
//     if (!existingEntry) {
//       await this.ketchup_reaction.create({
//         userId: userId,
//         ketchupId: ketchupId,
//         reactionId: existingIcon.id,
//       });
//     }
//   } else {
//     const existingEntry = await this.post_reaction.findOne({
//       where: {
//         userId: userId,
//         postId: postId,
//         reactionId: existingIcon.id,
//       },
//     });
//     if (!existingEntry) {
//       await this.post_reaction.create({
//         userId: userId,
//         postId: postId,
//         reactionId: existingIcon.id,
//       });
//     }
//   }
// }

// if (existingIcon) {
//   let existingEntry;
//   existingEntry = await this.ketchup_reaction.findOne({
//     where: {
//       userId: userId,
//       ketchupId: ketchupId,
//       reactionId: existingIcon.id,
//     },
//   });
//   existingEntry = await this.post_reaction.findOne({
//     where: {
//       userId: userId,
//       postId: postId,
//       reactionId: existingIcon.id,
//     },
//   });

//   console.log("existingEntry", existingEntry);

//   if (!existingEntry) {
//     if (control === 1) {
//       console.log("i am control 1");
//       await this.ketchup_reaction.create({
//         userId: userId,
//         ketchupId: ketchupId,
//         reactionId: existingIcon.id,
//       });
//       console.log("done adding existing emoji and entry");
//     } else {
//       console.log("i am control 2");
//       await this.post_reaction.create({
//         userId: userId,
//         postId: postId,
//         reactionId: existingIcon.id,
//       });
//       console.log("done adding existing emoji and entry");
//     }
//   }
// } else {
//   if (control === 1) {
//     console.log("i am control 1");
//     console.log("adding new emoji");
//     const newIcon = await this.reaction.create({ icon: formattedIcon });
//     console.log("newIcon", newIcon);

//     await this.ketchup_reaction.create({
//       userId: userId,
//       ketchupId: ketchupId,
//       reactionId: newIcon.id,
//     });
//     console.log("done adding new emoji and entry");
//   } else {
//     console.log("i am control 2");
//     const newIcon = await this.reaction.create({ icon: formattedIcon });

//     await this.post_reaction.create({
//       userId: userId,
//       postId: postId,
//       reactionId: newIcon.id,
//     });
//   }
// }

// if (control === 1) {
//   console.log("i am control 1");
//   // existing entry checks if user has already reacted w this icon for that specific ketchupId

//   if (!existingEntry && !existingIcon) {
//     console.log("adding new emoji");
//     const newIcon = await this.reaction.create({ icon: formattedIcon });
//     console.log("newIcon", newIcon);

//     await this.ketchup_reaction.create({
//       userId: userId,
//       ketchupId: ketchupId,
//       reactionId: newIcon.id,
//     });
//     console.log("done adding new emoji and entry");
//   } else if (!existingEntry && existingIcon) {
//     await this.ketchup_reaction.create({
//       userId: userId,
//       ketchupId: ketchupId,
//       reactionId: existingIcon.id,
//     });
//   }
