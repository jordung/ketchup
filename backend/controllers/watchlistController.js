const BaseController = require("./baseController");

class WatchlistController extends BaseController {
  constructor({ user, ticket, document, watcher, notification }) {
    super(watcher);
    this.user = user;
    this.ticket = ticket;
    this.document = document;
    this.watcher = watcher;
    this.notification = notification;
  }

  // =================== VIEW ALL TICKETS WATCHERS =================== //
  allTicketsWatchers = async (req, res) => {
    const { organisationId } = req.params;

    try {
      const allWatchers = await this.ticket.findAll({
        where: { organisationId },
        include: [
          {
            model: this.model,
            attributes: ["userId"],
            include: [
              {
                model: this.user,
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "lastName",
                  "profilePicture",
                ],
              },
            ],
          },
        ],
      });
      return res.status(200).json({
        success: true,
        data: allWatchers,
        msg: "Success: Retrieved all tickets watchers!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== ADD TICKET TO WATCH LIST =================== //
  // Note: Check if ticket has already been added to watchlist

  addTicketToWatchlist = async (req, res) => {
    const { userId, ticketId } = req.body;

    try {
      // check if user is currently watching the ticket before adding
      const existingWatchlist = await this.model.findOne({
        where: { userId: userId, ticketId: ticketId },
      });

      if (existingWatchlist) {
        return res.status(200).json({
          success: true,
          msg: `Success: You are already watching this ticket!`,
        });
      } else {
        await this.model.create({
          userId,
          ticketId,
        });
        const allWatchers = await this.model.findAll({
          where: { ticketId: ticketId },
          include: [
            {
              model: this.user,
              attributes: [
                "id",
                "firstName",
                "lastName",
                "lastName",
                "profilePicture",
              ],
            },
          ],
          attributes: ["id", "ticketId"],
        });

        return res.status(200).json({
          success: true,
          data: allWatchers,
          msg: `Success: Ticket has been added to your watchlist!`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== REMOVE TICKET FROM WATCH LIST =================== //
  stopWatchingTicket = async (req, res) => {
    const { userId, ticketId } = req.body;

    try {
      // check if user is watching the ticket before removing it
      const existingWatchlist = await this.model.findOne({
        where: { userId: userId, ticketId: ticketId },
      });

      if (!existingWatchlist) {
        return res.status(404).json({
          error: true,
          msg: "Error: You haven't added this ticket to your watchlist.",
        });
      } else {
        await this.model.destroy({
          where: { userId, ticketId },
        });

        const allWatchers = await this.model.findAll({
          where: { ticketId: ticketId },
          include: [
            {
              model: this.user,
              attributes: [
                "id",
                "firstName",
                "lastName",
                "lastName",
                "profilePicture",
              ],
            },
          ],
          attributes: ["id", "ticketId"],
        });
        return res.status(200).json({
          success: true,
          data: allWatchers,
          msg: `Success: You are no longer watching this ticket!`,
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

module.exports = WatchlistController;
