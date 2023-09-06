const BaseController = require("./baseController");

class AdminController extends BaseController {
  constructor({ user, invitation, organisation, organisation_admin }) {
    super(organisation);
    this.user = user;
    this.invitation = invitation;
    this.organisation = organisation;
    this.organisation_admin = organisation_admin;
  }

  // =================== GET ORGANISATION INFORMATION =================== //
  getOrganisation = async (req, res) => {
    const { organisationId } = req.params;

    try {
      const users = await this.user.findAll({
        include: [
          {
            model: this.organisation_admin,
            where: {
              organisationId: organisationId,
            },
            required: false,
          },
        ],
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
      });

      // return if user isAdmin in boolean
      const usersWithAdminStatus = users.map((user) => {
        return {
          ...user.toJSON(),
          isAdmin:
            typeof (
              user.dataValues.organisation_admin &&
              user.dataValues.organisation_admin.userId
            ) === "number",
        };
      });

      const invitees = await this.model.findByPk(organisationId, {
        include: [
          {
            model: this.invitation,
            attributes: ["inviteeEmail", "isConfirmed", "createdAt"],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: { usersWithAdminStatus, invitees },
        msg: "Success: Retrieved organisation information!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== UPDATE ORGANISATION PREFERENCES (TIMING) =================== //
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

  // =================== UPDATE ORGANISATION PREFERENCES (ASSIGN USER ROLE) =================== //
  // Note: The 'updateMemberStatus' API allows FE to execute both ADMIN and MEMBER (aka non-admin) roles on user

  updateMemberStatus = async (req, res) => {
    const { userId, organisationId } = req.body;

    const user = await this.user.findByPk(userId);

    // check if user is already an admin
    const isAdmin = await this.organisation_admin.findOne({
      where: { userId: userId, organisationId: organisationId },
    });
    try {
      if (!isAdmin) {
        // if user is currently NOT an admin, make user an admin
        await this.organisation_admin.create({
          userId: userId,
          organisationId: organisationId,
        });
        const users = await this.user.findAll({
          include: [
            {
              model: this.organisation_admin,
              where: {
                organisationId: organisationId,
              },
              // return empty array if organisation_admin not found in non-admin users
              required: false,
            },
          ],
          attributes: ["id", "firstName", "lastName", "profilePicture"],
        });

        // return if user isAdmin in boolean
        const usersWithAdminStatus = users.map((user) => {
          return {
            ...user.toJSON(),
            isAdmin:
              typeof (
                user.dataValues.organisation_admin &&
                user.dataValues.organisation_admin.userId
              ) === "number",
          };
        });

        return res.status(200).json({
          success: true,
          data: usersWithAdminStatus,
          msg: `Success: ${user.firstName} ${user.lastName} has been successfully updated to Admin!`,
        });
      } else {
        // if user is currently an admin, make user a member (aka non-admin)
        await this.organisation_admin.destroy({
          where: {
            userId: userId,
            organisationId: organisationId,
          },
        });

        const users = await this.user.findAll({
          include: [
            {
              model: this.organisation_admin,
              where: {
                organisationId: organisationId,
              },
              required: false,
            },
          ],
          attributes: ["id", "firstName", "lastName", "profilePicture"],
        });

        const usersWithAdminStatus = users.map((user) => {
          return {
            ...user.toJSON(),
            isAdmin:
              typeof (
                user.dataValues.organisation_admin &&
                user.dataValues.organisation_admin.userId
              ) === "number",
          };
        });

        return res.status(200).json({
          success: true,
          data: usersWithAdminStatus,
          msg: `Success: ${user.firstName} ${user.lastName} has been successfully updated to Member!`,
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

module.exports = AdminController;
