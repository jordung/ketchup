const BaseController = require("./baseController");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

class DailyKetchupController extends BaseController {
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
  }

  // =================== GET ALL TICKETS AND DOCUMENTS =================== //
  getInformation = async (req, res) => {
    const { organisationId } = req.params;

    try {
      const allTickets = await this.ticket.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      const allDocuments = await this.document.findAll({
        where: { organisationId },
        attributes: ["id", "name"],
      });

      return res.status(200).json({
        success: true,
        data: { allTickets, allDocuments },
        msg: "Success: All tickets retrieved!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  addNewKetchup = async (req, res) => {
    const { organisationId, userId, reactionId, agendas, updates } = req.body;

    if (agendas.length === 0) {
      return res.status(400).json({
        error: true,
        msg: "Error: Oops! Today's ketchup agenda is currently empty. Let's add some items!",
      });
    }

    try {
      // current date in SGT + set time to 12AM
      const startDate = moment().tz("Asia/Singapore").startOf("day");
      const endDate = moment().tz("Asia/Singapore").endOf("day");
      // console.log("start date", startDate.format());
      // console.log("end date", endDate.format());

      // note: for testing use only:
      // Set the start date to September 7th, 12:00 AM (SGT)
      // Set the end date to September 7th, 11:59:59 PM (SGT)
      // const startDate = moment("2023-09-07T13:00:00").utcOffset(8);
      // const endDate = moment("2023-09-07T23:59:59").utcOffset(8);

      const isFirstKetchup = await this.model.findOne({
        where: {
          createdAt: { [Op.between]: [startDate, endDate] },
          userId: userId,
        },
      });

      if (!isFirstKetchup) {
        // console.log("first scenario: user posted his first ketchup!");
        try {
          // 1. create a new ketchup
          const newKetchup = await this.model.create({
            organisationId,
            userId,
            reactionId,
          });

          try {
            // console.log("first scenario: ok adding agenda now!");
            // 2. add agenda(s) to ketchup
            // step 1: iterate through the array
            for (const agenda of agendas) {
              const { ticketId, documentId, flagId, content } = agenda;

              if (!content || !flagId) {
                return res.status(400).json({
                  error: true,
                  msg: "Error: Please fill in all required fields and try again.",
                });
              }

              // step 2: create new entries
              const newAgenda = await this.agenda.create({
                userId,
                ticketId,
                documentId,
                flagId,
                content,
              });

              await this.ketchup_agenda.create({
                ketchupId: newKetchup.id,
                agendaId: newAgenda.id,
              });
            }

            try {
              // console.log("first scenario: ok adding updates now!");
              // 3. add update(s) to ketchup, if any.
              // step 1: check if user has added updates
              if (!updates || updates.length === 0) {
                console.log("user did not include any updates!");
              } else {
                // step 2: iterate through the array
                for (const update of updates) {
                  const { ticketId, documentId, flagId, content } = update;

                  if (!content || !flagId) {
                    return res.status(400).json({
                      error: true,
                      msg: "Error: Please fill in all required fields and try again.",
                    });
                  }

                  // step 3: create new entries
                  const newUpdate = await this.update.create({
                    userId,
                    ticketId,
                    documentId,
                    flagId,
                    content,
                  });

                  await this.ketchup_update.create({
                    ketchupId: newKetchup.id,
                    updateId: newUpdate.id,
                  });
                }
              }

              return res.status(200).json({
                success: true,
                msg: "Success: Ketchup has been added successfully!",
              });
            } catch (error) {
              console.error("Error adding ketchup:", error);
            }
          } catch (error) {
            console.error("Error adding agendas:", error);
          }
        } catch (error) {
          console.error("Error adding updates:", error);
        }
      } else {
        // console.log("second scenario: user posted a second ketchup!");
        // user has already posted a ketchup
        const retrievedKetchupReactions = await this.ketchup_reaction.findAll({
          where: { ketchupId: isFirstKetchup.id },
        });
        // console.log("retrievedKetchupReactions", retrievedKetchupReactions);

        const deleteReactions = async (ketchupReactions) => {
          // console.log("removing reactions");
          for (const ketchup of ketchupReactions) {
            const ketchupId = ketchup.dataValues.ketchupId;

            await this.ketchup_reaction.destroy({
              where: {
                ketchupId: ketchupId,
              },
            });
          }
        };
        deleteReactions(retrievedKetchupReactions);

        const retrievedSubmittedAgendas = await this.ketchup_agenda.findAll({
          where: { ketchupId: isFirstKetchup.id },
        });

        const deleteAgendas = async (ketchupAgendas) => {
          // console.log("second scenario: deleting agendas now!");
          for (const agenda of ketchupAgendas) {
            const agendaId = agenda.dataValues.agendaId;

            await this.ketchup_agenda.destroy({
              where: {
                ketchupId: isFirstKetchup.id,
              },
            });

            try {
              await this.agenda.destroy({
                where: { id: agendaId },
              });
              console.log(`Agenda with ID ${agendaId} deleted successfully.`);
            } catch (error) {
              console.error(
                `Error deleting agendaId ${agendaId}: ${error.message}`
              );
            }
          }
        };
        deleteAgendas(retrievedSubmittedAgendas);

        const retrievedSubmittedUpdates = await this.ketchup_update.findAll({
          where: { ketchupId: isFirstKetchup.id },
        });

        const deleteUpdates = async (ketchupUpdates) => {
          // console.log("second scenario: deleting updates now!");
          for (const update of ketchupUpdates) {
            const updateId = update.dataValues.updateId;

            await this.ketchup_update.destroy({
              where: {
                ketchupId: isFirstKetchup.id,
              },
            });

            try {
              await this.update.destroy({
                where: { id: updateId },
              });
              console.log(`Update with ID ${updateId} deleted successfully.`);
            } catch (error) {
              console.error(
                `Error deleting updateId ${updateId}: ${error.message}`
              );
            }
          }
        };
        deleteUpdates(retrievedSubmittedUpdates);

        await this.model.destroy({
          where: {
            id: isFirstKetchup.id,
            userId: userId,
          },
        });
        // console.log("ketchup deleted!");

        try {
          // console.log("second scenario: now we are creating a new ketchup!");
          // 1. create a new ketchup
          const newKetchup = await this.model.create({
            organisationId,
            userId,
            reactionId,
          });

          try {
            // 2. add agenda(s) to ketchup
            // step 1: count the number of objects in the agendas array
            for (const agenda of agendas) {
              // console.log("second scenario: adding agendas!");
              // step 2: iterate through the array
              const { ticketId, documentId, flagId, content } = agenda;

              if (!content || !flagId) {
                return res.status(400).json({
                  error: true,
                  msg: "Error: Please fill in all required fields and try again.",
                });
              }

              // step 3: create new entries
              const newAgenda = await this.agenda.create({
                userId,
                ticketId,
                documentId,
                flagId,
                content,
              });

              await this.ketchup_agenda.create({
                ketchupId: newKetchup.id,
                agendaId: newAgenda.id,
              });
            }

            try {
              // 3. add update(s) to ketchup, if any.
              // step 1: check if user has added updates
              if (!updates || updates.length === 0) {
                console.log("user did not include any updates!");
              } else {
                // console.log("second scenario: adding updates!");
                // step 2: iterate through the array
                for (const update of updates) {
                  const { ticketId, documentId, flagId, content } = update;

                  if (!content || !flagId) {
                    return res.status(400).json({
                      error: true,
                      msg: "Error: Please fill in all required fields and try again.",
                    });
                  }

                  // step 3: create new entries
                  const newUpdate = await this.update.create({
                    userId,
                    ticketId,
                    documentId,
                    flagId,
                    content,
                  });

                  await this.ketchup_update.create({
                    ketchupId: newKetchup.id,
                    updateId: newUpdate.id,
                  });
                  // console.log("donezo!");
                }
              }
            } catch (error) {
              console.error("Error adding ketchup:", error);
            }
          } catch (error) {
            console.error("Error adding agendas:", error);
          }
        } catch (error) {
          console.error("Error adding updates:", error);
        }
        return res.status(200).json({
          success: true,
          msg: "Success: Ketchup has been added successfully!",
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

module.exports = DailyKetchupController;
