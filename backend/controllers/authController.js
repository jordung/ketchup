const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateAuthToken = require("../utils/authToken");
const saltRounds = 10;

const transporter = require("../config/email");
const nodemailer = require("nodemailer");
const generateEmailToken = require("../utils/emailToken");
const { verification } = require("../utils/emailTemplates");

class AuthController extends BaseController {
  constructor({ user, organisation, invitation, organisation_admin }) {
    super(user);
    this.user = user;
    this.organisation = organisation;
    this.invitation = invitation;
    this.organisation_admin = organisation_admin;
  }

  // ====== Signup through Ketchup & Invite? ====== //
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
        msg: "Error: missing information in the request.",
      });
    }

    try {
      // check if email exists = existing user
      const existingUser = await this.model.findOne({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json({
          error: true,
          msg: "Error: user already exists.",
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

      const user = await this.model.findByPk(newUser.id);
      // step 6: send verification email after user record has been inserted to database
      const emailSent = await this.sendVerificationEmail(user);

      if (emailSent) {
        return res.status(200).json({
          success: true,
          data: { user, accessToken },
          msg: "Success: user registered successfully and verification email has been sent to the new user!",
        });
      } else {
        return res.status(500).json({
          error: true,
          msg: "Error: unable to send verification email.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to register user.",
      });
    }
  };

  verifyEmail = async (req, res) => {
    // receive token from query parameter in the URL
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        error: true,
        msg: "Error: missing verification token.",
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
          msg: "Error: user not found or invalid verification token.",
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

  // ====== Login ====== //
  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        msg: "Error: missing email or password.",
      });
    }

    try {
      // step 1: check if user email exists
      const user = await this.model.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          error: true,
          msg: "Error: user email not found.",
        });
      } else {
        // note: bcrypt compare returns BOOLEAN
        const compare = await bcrypt.compare(password, user.password);

        // step 2: compare input password with the password store in database
        if (!compare) {
          return res.status(400).json({
            error: true,
            msg: "Error: incorrect password.",
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

        // step 6: pass access token in res for FE to retrieve
        return res.status(200).json({
          success: true,
          data: { currentUser, is_admin: isAdmin, accessToken },
          msg: "Success: user has logged in successfully!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: login unsuccessful.",
      });
    }
  };

  // ====== Logout ====== //
  logout = async (req, res) => {
    // step 1: retrieve id from jwt payload
    const { userId } = req.user.id;
    try {
      // step 2: remove user's refreshToken from database
      await this.model.update(
        { refreshToken: null },
        { where: { id: userId } }
      );

      return res.status(200).json({
        success: true,
        msg: "Success: user logged out successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: logout unsuccessful.",
      });
    }
  };

  // ====== Validate Refresh Token ====== //
  validateRefreshToken = async (req, res) => {
    // step 1: retrieve refresh token from localStorage
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: true,
        msg: "Error: missing refresh token.",
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
          msg: "Error: user not found.",
        });
      }
      // step 5: pass access token in res for FE to retrieve
      return res.status(200).json({
        success: true,
        data: user,
        msg: "Success: user is authenticated!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to authenticate user.",
      });
    }
  };

  // ====== Renew Access Token ====== //
  renewAccessToken = async (req, res) => {
    // step 1: retrieve refresh token from localStorage
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: true,
        msg: "Error: missing refresh token.",
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
          msg: "Error: user not found.",
        });
      }

      // step 4: issue new access token
      const accessToken = generateAuthToken({
        id: user.id,
        email: user.email,
      });

      // step 5: pass access token in res for FE to retrieve
      return res.status(200).json({
        success: true,
        data: { user, accessToken },
        msg: "Success: access token renewed successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to renew access token.",
      });
    }
  };

  // ====== Join or Create Organisation ====== //
  joinOrCreateOrganisation = async (req, res) => {
    const { control, organisationName, inviteCode, userId } = req.body;

    try {
      let user;
      // 1 = create organisation
      if (control === 1) {
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
      } else if (control === 2) {
        // 2 = join organisation
        // step 1: find organisation based on the invitation code
        const joinOrganisation = await this.invitation.findOne({
          where: { inviteCode },
        });

        // step 2: update user record with the organisation_id
        await this.model.update(
          {
            organisationId: joinOrganisation.organisationId,
          },
          { where: { id: userId } }
        );

        // step 3: update is_confirmed to true
        await this.invitation.update({
          isConfirmed: true,
        });

        user = await this.model.findOne({ where: { id: userId } });
      } else {
        return res.status(400).json({
          error: true,
          msg: "Error: invalid request.",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        msg: "Success: user has joined or created organisation successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to join or create organisation.",
      });
    }
  };

  // ====== DELETE USER ====== //
  deleteOneUser = async (req, res) => {
    const { userId } = req.params;
    const transaction = await sequelize.transaction();
    console.log("userId", userId);

    try {
      const user = await this.model.findByPk(userId, {
        include: [
          {
            model: this.organisation_admin,
          },
        ],
      });
      console.log("user", user);

      // check if user exists
      if (!user) {
        return res.status(404).json({
          error: true,
          msg: "Error: user not found.",
        });
      }

      // delete associated records from the children tables
      console.log("user.organisation_admin", user.organisation_admin);

      if (user.organisation_admin !== null) {
        await this.organisation_admin.destroy({
          where: { userId: userId },
        });
      } else {
        // delete associated record from 'users' (parent) table
        await this.model.destroy({
          where: { id: userId },
        });
      }

      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Success: user has been removed from Ketchup!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to remove user.",
      });
    }
  };

  // ====== Function to Send Verification Email ====== //
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
    console.log(__dirname); // Print the current directory
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
