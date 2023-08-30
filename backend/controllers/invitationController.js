const BaseController = require("./baseController");

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

  // Signup Through Invite Flow:
  // 1. New user will be invited by their organisation admin
  // 2. An invitation email will be sent to the invitee's email address
  // 3. The invitee will be redirected to Ketchup's signup page and register as a new user
  // 4. The organisation id will be retrieved via query params
  // 5. Proceed with the signup request passing user info + organisation id
  // 6. Verify Email

  // ====== invite users ====== //
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
      return res.status(401).json({
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

      return res.status(200).json({
        success: true,
        msg: "Success: An email invitation has been sent to the email address!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an issue while attempting to send the invite. Please refresh the page and try again.",
      });
    }
  };

  // ====== Get Organisation ====== //
  getOrganissation = async (req, res) => {
    // receive invite code from URL query parameter
    const { inviteCode } = req.query;

    if (!inviteCode) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please provide the invitation code.",
      });
    }

    try {
      // check if user has indeed been invited to join organisation
      const invitee = await this.invitation.findOne({
        where: { inviteCode: inviteCode },
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
        // retrieve organisation id and pass to FE
        const organisation = invitee.organisation;
        console.log("organisation", organisation);

        return res.status(200).json({
          success: true,
          data: organisation,
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
}

module.exports = InvitationController;
