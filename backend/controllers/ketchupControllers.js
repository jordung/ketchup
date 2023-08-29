const BaseController = require("./baseController");

class KetchupController extends BaseController {
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

  // ====== Get Organisation Id ====== //
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
      });

      if (!invitee) {
        return res.status(404).json({
          error: true,
          msg: "Error: Invalid verification code",
        });
      } else {
        // retrieve organisation id and pass to FE
        const organisationId = invitee.organisationId;

        return res.status(200).json({
          success: true,
          data: organisationId,
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

module.exports = KetchupController;
