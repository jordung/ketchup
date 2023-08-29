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

  // FLOW:
  // 1. Organisation admin to invite new users
  // 2. Invitation email will be sent to the invitee's email address
  // 3. The invitee will be directed to Ketchup's signup page and register as new user

  //TODO: grab organisationId from token

  //? To check with Jordan the following:
  // step 6: verify email address? do we sill need this step?
  // step 7: update user table with is confirmed = true, refresh token, and if need send email verification then emailVerified = true

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
    console.log("step 2 check isAdmin:", isAdmin);

    if (!isAdmin) {
      return res.status(400).json({
        error: true,
        msg: "Error: invitation request can only be made by admin users.",
      });
    }

    const organisationName = inviter.organisation.name;
    console.log("organisationName:", organisationName);

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
      const invitationLink = `${process.env.APP_URL}/invite?token=${invitationCode}`;
      console.log("invitationLink", invitationLink);
      console.log("invitationLink", organisationName);

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
      console.log("message", message);

      await createTransporter.sendMail(message);

      return res.status(200).json({
        success: true,
        msg: "Success: invitation sent!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to send invitation.",
      });
    }
  };

  // ====== Get Organisation Id ====== //
  getOrganissation = async (req, res) => {
    // receive token from query parameter in the URL
    const { inviteCode } = req.query;

    if (!inviteCode) {
      return res.status(400).json({
        error: true,
        msg: "Error: missing invitation code.",
      });
    }

    try {
      // find user based on the verification token
      const invitee = await this.invitation.findOne({
        where: { inviteCode: inviteCode },
      });

      if (!invitee) {
        return res.status(404).json({
          error: true,
          msg: "Error: invitee not found or invalid invitation code.",
        });
      } else {
        // update email verified to true
        const organisationId = invitee.organisationId;

        return res.status(200).json({
          success: true,
          data: organisationId,
          msg: "Success: email verified!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to verify email.",
      });
    }
  };
}

module.exports = InvitationController;
