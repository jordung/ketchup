const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index");

const generateEmailToken = require("../utils/emailToken");
const { invitation } = require("../utils/emailTemplates");
const transporter = require("../config/email");

class InvitationController extends BaseController {
  constructor({ user, invitation, organisation, organisation_admin }) {
    super(user);
    this.user = user;
    this.invitation = invitation;
    this.organisation = organisation;
    this.organisation_admin = organisation_admin;
  }

  // Note: Admin Invites New User Flow:
  // 1. Admin send an invitation email to new user (aka invitee) -> call 'inviteUsers' API.
  // 2. The invitee will receive an email containing both invite link and invite code.
  // 3A. If invitee chooses to click on invite link -> call 'signUpThroughInvite' API -> followed by the 'getOrganisation' API to retrieve organisation information.
  // 3B. If invitee chooses to sign up directly via Ketchup page (using the invite code) -> call 'joinOrCreateOrganisation' API from auth controller -> user selects 'join organisation' and provide the invite code.
  // 4. Sign up success, email verification will be sent to the new user email address.
  // 5. Verify Email -> call 'verifyEmail' API

  // =================== INVITE USERS =================== //
  inviteUsers = async (req, res) => {
    const { userId, inviteeEmail } = req.body;

    // check if user is admin
    const inviter = await this.model.findByPk(userId, {
      include: [
        {
          model: this.organisation_admin,
        },
        {
          model: this.organisation,
          attributes: ["name"],
        },
      ],
    });

    // return true if user is an admin
    const isAdmin = inviter.organisation_admin !== null;

    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        msg: "Error: You are not authorised to send invitation request.",
      });
    }

    const organisationName = inviter.organisation.name;

    try {
      // generate invitation code
      const invitationCode = generateEmailToken();

      // create a new invitation
      await this.invitation.create({
        organisationId: inviter.organisationId,
        inviteCode: invitationCode,
        inviteeEmail: inviteeEmail,
      });

      // send the invitation email
      const createTransporter = await transporter;
      const invitationLink = `${process.env.APP_URL}/invite?inviteCode=${invitationCode}`;

      const message = {
        from: process.env.NODEMAILER_EMAIL,
        to: inviteeEmail,
        subject: "You have been invited to join Ketchup!",
        html: invitation(
          invitationLink,
          inviteeEmail,
          organisationName,
          invitationCode
        ),
        attachments: [
          {
            filename: "ketchup-logo.png",
            path: "./assets/ketchup-logo.png",
            cid: "unique@cid",
          },
        ],
      };

      await createTransporter.sendMail(message);

      const invitees = await this.organisation.findByPk(
        inviter.organisationId,
        {
          include: [
            {
              model: this.invitation,
              attributes: ["inviteeEmail", "isConfirmed", "createdAt"],
            },
          ],
        }
      );

      return res.status(200).json({
        success: true,
        data: invitees,
        msg: "Success: An email invitation has been sent to the email address!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an issue while attempting to send the invite. Please refresh the page and try again.",
      });
    }
  };

  // =================== GET ORGANISATION INFORMATION (FOR SIGNUP THROUGH INVITE LINK) =================== //
  getOrganissation = async (req, res) => {
    // receive invite code from URL query parameter
    const { inviteCode } = req.query;

    // check if invite code exists
    const findInvitation = await this.invitation.findOne({
      where: { inviteCode: inviteCode },
    });

    // check if the invite code has already been used
    const checkInviteCode = findInvitation.isConfirmed;

    if (!inviteCode) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please provide the invitation code.",
      });
    } else if (inviteCode && checkInviteCode === true) {
      return res.status(400).json({
        error: true,
        msg: "Error: Invitation code has already been used! Please log in instead",
      });
    }

    try {
      // check if user has indeed been invited to join organisation
      const invitee = await this.invitation.findOne({
        where: { inviteCode: inviteCode },
        attributes: ["inviteeEmail"],
        include: [
          {
            model: this.organisation,
          },
        ],
      });

      if (!invitee) {
        return res.status(404).json({
          error: true,
          msg: "Error: Invalid invitation code",
        });
      } else {
        // retrieve organisation id + invitee email
        const organisation = invitee.organisation;
        const inviteeEmail = invitee.inviteeEmail;

        return res.status(200).json({
          success: true,
          data: { organisation, inviteeEmail },
          msg: "Success: You have been invited by your organisation to join Ketchup!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We are unable to proceed with your request. Please try again later or contact our support team for further assistance.",
      });
    }
  };

  // =================== FOR TESTING ONLY: REMOVE INVITATION RECORD =================== //
  removeInvitation = async (req, res) => {
    const { userId } = req.params;
    const transaction = await sequelize.transaction();

    try {
      // check if user exists
      const user = await this.model.findByPk(userId);

      if (user) {
        // update user row to remove organisation id
        await this.model.update(
          {
            organisationId: null,
          },
          { where: { id: userId } }
        );
        // delete associated records from the children tables
        await this.invitation.destroy({ where: { inviteeEmail: user.email } });
      } else {
        return res.status(404).json({
          error: true,
          msg: "Error: Account not found",
        });
      }

      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Success: Removed invitation to join organisation!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };
}

module.exports = InvitationController;
