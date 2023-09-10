const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index");
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateAuthToken = require("../utils/authToken");
const saltRounds = 10;

const transporter = require("../config/email");
const nodemailer = require("nodemailer");
const generateEmailToken = require("../utils/emailToken");
const { verification } = require("../utils/emailTemplates");
class AuthController extends BaseController {
  constructor({
    user,
    organisation,
    invitation,
    organisation_admin,
    ticket,
    ticket_dependency,
    document,
    document_ticket,
    watcher,
    post,
    post_reaction,
    ketchup,
    ketchup_reaction,
    agenda,
    ketchup_agenda,
    update,
    ketchup_update,
    notification,
  }) {
    super(user);
    this.user = user;
    this.organisation = organisation;
    this.invitation = invitation;
    this.organisation_admin = organisation_admin;
    this.ticket = ticket;
    this.ticket_dependency = ticket_dependency;
    this.document = document;
    this.document_ticket = document_ticket;
    this.watcher = watcher;
    this.post = post;
    this.post_reaction = post_reaction;
    this.ketchup = ketchup;
    this.ketchup_reaction = ketchup_reaction;
    this.agenda = agenda;
    this.ketchup_agenda = ketchup_agenda;
    this.update = update;
    this.ketchup_update = ketchup_update;
    this.notification = notification;
  }

  // Note: Signup Through Ketchup Flow:
  // 1. Sign up as new user (organisationId = null)
  // 2. User to join or create new organisation -> call 'joinOrCreateOrganisation' API
  // 2A. If user choose to create a new organisation -> user to provide organisationName and assign user as ADMIN
  // 2B. If user choose to join organisation -> user to provide invite code
  // 3. Verify Email -> call 'verifyEmail' API

  // =================== SIGN UP THROUGH KETCHUP (DIRECT, WITH OR W/O INVITE CODE) =================== //
  signUp = async (req, res) => {
    const {
      organisationId,
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !profilePicture) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please fill in all required fields and try again.",
      });
    }

    try {
      // check if user exists
      const existingUser = await this.model.findOne({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json({
          error: true,
          msg: "Error: An account with this email address already exists.",
        });
      }

      // step 1: hash password
      const hashPassword = await bcrypt.hash(password, saltRounds);

      // step 2: create new user
      const newUser = await this.model.create({
        organisationId: organisationId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword,
        profilePicture: profilePicture,
      });

      // step 3: create a payload for jwt
      const payload = {
        id: newUser.id,
        email: newUser.email,
      };

      // step 4: create tokens
      const accessToken = generateAuthToken(payload);
      const refreshToken = generateAuthToken(payload, true);
      const verificationToken = generateEmailToken();
      // step 5: update user info to include refresh token
      await this.model.update(
        {
          refreshToken: refreshToken,
          verificationToken: verificationToken,
        },
        { where: { id: newUser.id } }
      );

      // step 6: notify organisation members
      const user = await this.model.findByPk(newUser.id);

      if (organisationId) {
        const organisation = await this.organisation.findByPk(organisationId);
        const allOrganisationMembers = await this.model.findAll({
          where: { organisationId },
        });

        for (const member of allOrganisationMembers) {
          const memberId = member.dataValues.id;
          try {
            await this.notification.create({
              organisationId,
              userId: memberId,
              type: "new joiner",
              message: `${user.firstName} ${user.lastName} has joined ${organisation.name}.`,
            });
          } catch (error) {
            console.error("Error: Unable to notify all organisation members!");
          }
        }
      }

      // step 6: send verification email after user record has been inserted to database
      const emailSent = await this.sendVerificationEmail(user);

      if (emailSent) {
        return res.status(200).json({
          success: true,
          data: { user, accessToken },
          msg: "Success: Thank you for joining Ketchup! Your account has been created successfully.",
        });
      } else {
        return res.status(500).json({
          error: true,
          msg: "Error: Oops! We encountered a problem while sending the verification email. Please refresh the page and try again.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: Oops! We stumbled upon an issue while setting up your account. Please refresh the page and try again.",
      });
    }
  };

  // Note: Signup Through Invite Link Flow:
  // 1. Sign up as new user (FE to call 'getOrganisation' API from invite controller to retrieve organistion information)
  // 2. Verify Email -> call 'verifyEmail' API

  // =================== SIGN UP THROUGH INVITE (INVITE LINK) =================== //
  signUpThroughInvite = async (req, res) => {
    const {
      organisationId,
      firstName,
      lastName,
      email,
      password,
      profilePicture,
      inviteCode,
    } = req.body;

    if (
      !organisationId ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !profilePicture
    ) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please fill in all required fields and try again.",
      });
    }

    try {
      // check if user exists
      const existingUser = await this.model.findOne({
        where: { email: email },
      });

      // validate both invite code and email address before creating a new account
      const validateInviteCode = await this.invitation.findOne({
        where: { inviteCode: inviteCode, inviteeEmail: email },
      });

      if (!validateInviteCode) {
        return res.status(400).json({
          error: true,
          msg: "Error: Incorrect invitation code or email address",
        });
      } else if (existingUser && validateInviteCode) {
        return res.status(400).json({
          error: true,
          msg: "Error: Invitation code has already been used! Please log in instead",
        });
      } else {
        // update is_confirmed in invitation table to true
        await this.invitation.update(
          {
            isConfirmed: true,
          },
          { where: { inviteeEmail: email } }
        );

        // create new account
        // step 1: hash password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // step 2: create new user
        const newUser = await this.model.create({
          organisationId: organisationId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashPassword,
          profilePicture: profilePicture,
        });

        // step 3: create a payload for jwt
        const payload = {
          id: newUser.id,
          email: newUser.email,
        };

        // step 4: create tokens
        const accessToken = generateAuthToken(payload);
        const refreshToken = generateAuthToken(payload, true);
        const verificationToken = generateEmailToken();

        // step 5: update user info to include refresh token
        await this.model.update(
          {
            refreshToken: refreshToken,
            verificationToken: verificationToken,
          },
          { where: { id: newUser.id } }
        );

        // step 6: notify organisation members
        const user = await this.model.findByPk(newUser.id);
        const organisation = await this.organisation.findByPk(organisationId);
        const allOrganisationMembers = await this.model.findAll({
          where: { organisationId },
        });

        for (const member of allOrganisationMembers) {
          const memberId = member.dataValues.id;
          try {
            await this.notification.create({
              organisationId,
              userId: memberId,
              type: "new joiner",
              message: `${user.firstName} ${user.lastName} has joined ${organisation.name}.`,
            });
          } catch (error) {
            console.error("Error: Unable to notify all organisation members!");
          }
        }

        // step 7: send verification email after user record has been inserted to database
        const emailSent = await this.sendVerificationEmail(user);

        if (emailSent) {
          return res.status(200).json({
            success: true,
            data: { user, accessToken },
            msg: "Success: Thank you for joining Ketchup! Your account has been created successfully.",
          });
        } else {
          return res.status(500).json({
            error: true,
            msg: "Error: Oops! We encountered a problem while sending the verification email. Please refresh the page and try again.",
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: Oops! We stumbled upon an issue while setting up your account. Please refresh the page and try again.",
      });
    }
  };

  // =================== VERIFY EMAIL =================== //
  verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please provide the verification code.",
      });
    }

    try {
      // find user based on the verification token
      const user = await this.model.findOne({
        where: { verificationToken: token },
      });

      if (!user) {
        return res.status(404).json({
          error: true,
          msg: "Error: Invalid verification code",
        });
      } else {
        // update email verified to true
        await this.model.update(
          {
            emailVerified: true,
          },
          { where: { id: user.id } }
        );

        // retrieve user information and pass to FE
        const verifiedUser = await this.model.findByPk(user.id, {
          include: [
            {
              model: this.organisation,
              attributes: ["name"],
            },
          ],
        });

        return res.status(200).json({
          success: true,
          data: { verifiedUser },
          msg: "Success: Your email address has been successfully verified!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: Your email address could not be verified. Please try again.",
      });
    }
  };

  // =================== USER LOGS IN =================== //
  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please fill in all required fields and try again.",
      });
    }

    try {
      // step 1: check if user exists
      const user = await this.model.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          error: true,
          msg: "Error: Account not found",
        });
      } else {
        // note: bcrypt compare returns boolean
        const compare = await bcrypt.compare(password, user.password);

        // step 2: compare input password with the password store in database
        if (!compare) {
          return res.status(400).json({
            error: true,
            msg: "Error: Incorrect password",
          });
        }

        // step 3: create a payload for jwt
        const payload = { id: user.id, email: user.email };

        // step 4: create tokens
        const accessToken = generateAuthToken(payload);
        const refreshToken = generateAuthToken(payload, true);

        // step 5: update user info to include refresh token
        await this.model.update(
          {
            refreshToken: refreshToken,
          },
          { where: { id: user.id } }
        );

        // display user information (incl. if user is admin)
        const currentUser = await this.model.findByPk(user.id, {
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

        // return true if the user is an admin
        const isAdmin = currentUser.organisation_admin !== null;

        return res.status(200).json({
          success: true,
          data: { currentUser, is_admin: isAdmin, accessToken },
          msg: "Success: You are now logged into your account.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: Please try again with the correct email and password.",
      });
    }
  };

  // =================== USER LOGS OUT =================== //
  logout = async (req, res) => {
    const { userId } = req.body;
    try {
      // step 2: remove user's refreshToken from database
      await this.model.update(
        { refreshToken: null },
        { where: { id: userId } }
      );

      return res.status(200).json({
        success: true,
        msg: "Success: You've been successfully logged out!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered a problem while attempting to log you out. Please refresh the page and try again.",
      });
    }
  };

  // =================== VALIDATE REFRESH TOKEN =================== //
  validateRefreshToken = async (req, res) => {
    // step 1: retrieve refresh token from localStorage
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: true,
        msg: "Error: We are unable to proceed with your request. Please try again later or contact our support team for further assistance.",
      });
    }
    try {
      // step 2: verify the refresh token
      const data = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

      // step 3: find if user w the refresh token exists
      const user = await this.model.findOne({
        where: { id: data.id },
        include: [
          {
            model: this.organisation,
            attributes: ["name"],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: true,
          msg: "Error: Account not found",
        });
      }

      // step 4: issue new access token
      const accessToken = generateAuthToken({
        id: user.id,
        email: user.email,
      });

      return res.status(200).json({
        success: true,
        data: { user, accessToken },
        msg: "Success: You are now logged into your account.",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an issue while attempting to log you in. Please refresh the page and try again.",
      });
    }
  };

  // =================== RENEW ACCESS TOKEN =================== //
  renewAccessToken = async (req, res) => {
    // step 1: retrieve refresh token from localStorage
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: true,
        msg: "Error: We are unable to proceed with your request. Please try again later or contact our support team for further assistance.",
      });
    }
    try {
      // step 2: verify the refresh token
      const data = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

      // step 3: find if user w the refresh token exists
      const user = await this.model.findOne({
        where: { id: data.id },
        include: [
          {
            model: this.organisation,
            attributes: ["name"],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: true,
          msg: "Error: Account not found",
        });
      }

      // step 4: issue new access token
      const accessToken = generateAuthToken({
        id: user.id,
        email: user.email,
      });

      return res.status(200).json({
        success: true,
        data: { user, accessToken },
        msg: "Success: You are now logged into your account.",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an issue while attempting to log you in. Please refresh the page and try again.",
      });
    }
  };

  // =================== JOIN (W INVITE CODE) OR CREATE AN ORGANISATION =================== //
  joinOrCreateOrganisation = async (req, res) => {
    const { control, organisationName, inviteCode, userId, email } = req.body;

    try {
      let user;
      let organisation;
      let formattedOrganisationName;

      // if organisationName is null, return empty string
      organisationName
        ? (formattedOrganisationName = organisationName.toLowerCase())
        : "";

      // 1 = create organisation
      if (control === 1) {
        const checkExisting = await this.organisation.findOne({
          where: { name: { [Op.iLike]: formattedOrganisationName } },
        });

        if (checkExisting) {
          return res.status(400).json({
            error: true,
            msg: "Error: Organisation name taken, please pick another name.",
          });
        } else {
          // step 1: create new organisation
          const newOrganisation = await this.organisation.create({
            name: organisationName,
          });

          // step 2: add user to the newly created organisation
          await this.model.update(
            {
              organisationId: newOrganisation.id,
            },
            { where: { id: userId } }
          );

          // step 3: assign user as admin
          await this.organisation_admin.create({
            userId: userId,
            organisationId: newOrganisation.id,
          });

          user = await this.model.findOne({ where: { id: userId } });
          organisation = await this.organisation.findByPk(user.organisationId);

          return res.status(200).json({
            success: true,
            data: user,
            msg: `Success: You have created ${organisation.name}!`,
          });
        }
      } else if (control === 2) {
        // 2 = join organisation
        // step 1: find organisation based on the invitation code and email
        const joinOrganisation = await this.invitation.findOne({
          where: { inviteCode, inviteeEmail: email },
        });

        if (!joinOrganisation) {
          return res.status(400).json({
            error: true,
            msg: "Error: Invalid invitation code",
          });
        }

        // step 2: update user record with the organisation_id
        await this.model.update(
          {
            organisationId: joinOrganisation.organisationId,
          },
          { where: { id: userId } }
        );

        // step 3: update is_confirmed to true
        await this.invitation.update(
          {
            isConfirmed: true,
          },
          { where: { inviteeEmail: email } }
        );

        // step 4: notify organisation members
        user = await this.model.findOne({ where: { id: userId } });
        organisation = await this.organisation.findByPk(user.organisationId);

        const allOrganisationMembers = await this.model.findAll({
          where: { organisationId: user.organisationId },
        });

        for (const member of allOrganisationMembers) {
          const memberId = member.dataValues.id;
          try {
            await this.notification.create({
              organisationId: user.organisationId,
              userId: memberId,
              type: "new joiner",
              message: `${user.firstName} ${user.lastName} has joined ${organisation.name}.`,
            });
          } catch (error) {
            console.error("Error: Unable to notify all organisation members!");
          }
        }

        return res.status(200).json({
          success: true,
          data: user,
          msg: `Success: You have joined ${organisation.name}!`,
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

  // =================== REMOVE USER FROM KETCHUP =================== //
  deleteOneUser = async (req, res) => {
    const { userId } = req.params;
    const transaction = await sequelize.transaction();
    try {
      // check if user exists
      const user = await this.model.findByPk(userId, {
        include: [
          {
            model: this.notification,
          },
          {
            model: this.watcher,
          },
          {
            model: this.update,
            as: "update_creator",
            include: [{ model: this.ketchup_update }],
          },
          {
            model: this.agenda,
            as: "agenda_creator",
            include: [{ model: this.ketchup_agenda }],
          },
          {
            model: this.post_reaction,
          },
          {
            model: this.post,
          },
          {
            model: this.ketchup_reaction,
          },
          {
            model: this.ketchup,
            as: "ketchup_creator",
          },
          {
            model: this.document,
            as: "document_creator",
          },
          {
            model: this.ticket,
            as: "ticket_creator",
          },
          {
            model: this.ticket,
            as: "assignee",
          },
        ],
      });
      // console.log("user", user);

      if (!user) {
        return res.status(404).json({
          error: true,
          msg: "Error: Account not found",
        });
      }

      console.log("user", user);

      // remove notifications
      if (user.notifications.length > 0) {
        await this.notification.destroy({ where: { userId } });
      }

      // remove user's watching list
      if (user.watchers.length > 0) {
        await this.watcher.destroy({ where: { userId } });
      }

      // remove all updates added by the user
      if (user.update_creator.length > 0) {
        for (const update of user.update_creator) {
          const updateId = update.dataValues.id;
          await this.ketchup_update.destroy({ where: { updateId } });
          await this.update.destroy({ where: { id: updateId } });
        }
      }

      // remove all agendas added by the user
      if (user.agenda_creator.length > 0) {
        for (const agenda of user.agenda_creator) {
          const agendaId = agenda.dataValues.id;
          await this.ketchup_agenda.destroy({ where: { agendaId } });
          await this.agenda.destroy({ where: { id: agendaId } });
        }
      }

      // remove all post reactions added by the user
      if (user.post_reactions.length > 0) {
        for (const postReaction of user.post_reactions) {
          const userId = postReaction.dataValues.userId;
          await this.post_reaction.destroy({ where: { userId } });
        }
      }

      const userPosts = await this.post.findAll({
        where: { userId },
      });

      // remove all posts added by the user
      if (userPosts.length > 0) {
        for (const post of userPosts) {
          const postId = post.dataValues.id;
          await this.post_reaction.destroy({ where: { postId } });
          await this.post.destroy({ where: { id: postId } });
        }
      }

      // remove all documents added by the user
      // for ketchup v2, the user icon/tooltip will display "deactivated"
      if (user.document_creator.length > 0) {
        for (const document of user.document_creator) {
          const documentId = document.dataValues.id;
          await this.notification.destroy({ where: { documentId } });
          await this.watcher.destroy({ where: { documentId } });
          await this.document_ticket.destroy({
            where: { documentId },
          });
          await this.document.destroy({ where: { id: documentId } });
        }
      }

      // remove all tickets created by the user
      if (user.ticket_creator.length > 0) {
        for (const ticket of user.ticket_creator) {
          const ticketId = ticket.dataValues.id;
          const creatorId = ticket.dataValues.creatorId;
          const assigneeId = ticket.dataValues.assigneeId;

          if (assigneeId !== null) {
            if (assigneeId === creatorId) {
              // console.log(
              //   "assignee id and creator id are the same so ticket will be deleted"
              // );
              await this.notification.destroy({
                where: { ticketId },
              });
              await this.watcher.destroy({ where: { ticketId } });
              await this.ticket_dependency.destroy({
                where: { dependencyId: ticketId },
              });
              await this.ticket_dependency.destroy({
                where: { ticketId },
              });
              await this.document_ticket.destroy({
                where: { ticketId },
              });

              await this.ticket.destroy({ where: { id: ticketId } });
            } else {
              // console.log("reassigning ticket to assignee");
              await this.ticket.update(
                { creatorId: assigneeId },
                { where: { id: ticketId } }
              );
            }
          } else {
            // console.log("no assignee so ticket will be deleted");
            await this.notification.destroy({ where: { ticketId } });
            await this.watcher.destroy({ where: { ticketId } });
            await this.ticket_dependency.destroy({
              where: { dependencyId: ticketId },
            });
            await this.ticket_dependency.destroy({
              where: { ticketId: ticketId },
            });
            await this.document_ticket.destroy({
              where: { ticketId: ticketId },
            });
            await this.ticket.destroy({ where: { id: ticketId } });
          }
        }
      }

      if (user.assignee.length > 0) {
        // console.log("removing user from the assigned tickets");
        for (const ticket of user.assignee) {
          const ticketId = ticket.dataValues.id;
          // const assigneeId = ticket.dataValues.assigneeId;
          await this.ticket.update(
            { assigneeId: null },
            { where: { id: ticketId } }
          );
        }
      }
      // remove all ketchup reactions added by the user
      if (user.ketchup_reactions.length > 0) {
        for (const ketchupReaction of user.ketchup_reactions) {
          const userId = ketchupReaction.dataValues.userId;
          await this.ketchup_reaction.destroy({ where: { userId } });
        }
      }

      // remove all ketchups added by the user
      if (user.ketchup_creator.length > 0) {
        for (const ketchup of user.ketchup_creator) {
          const ketchupId = ketchup.dataValues.id;
          await this.ketchup_reaction.destroy({ where: { ketchupId } });
          await this.notification.destroy({
            where: { ketchupId },
          });
          await this.ketchup.destroy({ where: { id: ketchupId } });
        }
      }

      // check if user has been assigned as admin
      const isAdmin = await this.organisation_admin.findOne({
        where: { userId },
      });

      if (isAdmin !== null) {
        // console.log("removing user from organisation admin!");
        await this.organisation_admin.destroy({ where: { userId } });
      }

      // remove user from invitation
      const findInvitation = await this.invitation.findOne({
        where: { inviteeEmail: user.email },
      });

      if (findInvitation !== null) {
        // console.log("removing email invitation!");
        await this.invitation.destroy({ where: { inviteeEmail: user.email } });
      }

      await this.model.destroy({
        where: { id: userId },
      });

      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Success: User account has been removed from Ketchup!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: We encountered an error while handling your request. Please try again.",
      });
    }
  };

  // =================== FUNCTION TO SEND VERIFICATION EMAIL =================== //
  sendVerificationEmail = async (user) => {
    const createTransporter = await transporter;
    const verificationLink = `${process.env.APP_URL}/verify?token=${user.verificationToken}`;

    const message = {
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: "Welcome to Ketchup! Verify Your Email Address",
      html: verification(user, verificationLink),
      attachments: [
        {
          filename: "ketchup-logo.png",
          path: "./assets/ketchup-logo.png",
          cid: "unique@cid",
        },
      ],
    };

    try {
      await createTransporter.sendMail(message);
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };
}

module.exports = AuthController;
