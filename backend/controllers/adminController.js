const BaseController = require("./baseController");

class AdminController extends BaseController {
  constructor({ user, organisation, organisation_admin }) {
    super(organisation);
    this.user = user;
    this.organisation = organisation;
    this.organisation_admin = organisation_admin;
  }

  // ? align w jordan on the info that needs to be returned
  // ? check w jordan if we're blocking view for non-admin users? or are we just gonna not let them edit the fields

  // ====== Get User Profile ====== //
  getOrganisation = async (req, res) => {
    const { organisationId } = req.params;

    try {
      const organisation = await this.model.findByPk(organisationId, {
        include: [
          {
            model: this.organisation_admin,
            attributes: ["userId", "organisationId"],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: organisation,
        msg: "Success: Retrieved organisation information!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // ====== Update User Profile ====== //
  updateOrganisationTiming = async (req, res) => {
    const { organisationId } = req.params;
    const { time } = req.body;

    try {
      await this.model.update(
        {
          time: time,
        },
        { where: { id: organisationId } }
      );

      const organisation = await this.model.findByPk(organisationId, {
        include: [
          {
            model: this.organisation_admin,
            attributes: ["userId", "organisationId"],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: organisation,
        msg: "Success: Organisation timing has been updated!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };
}

module.exports = AdminController;
