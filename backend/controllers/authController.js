const BaseController = require("./baseController");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAuthToken } = require("../utils/authToken");
const saltRounds = 10;

class AuthController extends BaseController {
  constructor({ user, organisation, invitation }) {
    super(user);
    this.user = user;
    this.organisation = organisation;
    this.invitation = invitation;
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

      // step 5: update user info to include refresh token
      await this.model.update(
        {
          refreshToken: refreshToken,
        },
        { where: { id: newUser.id } }
      );

      // step 6: pass access token in res for FE to retrieve
      return res.status(200).json({
        success: true,
        data: { newUser, accessToken },
        msg: "Success: user registered successfully!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to register user.",
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

        // step 6: pass access token in res for FE to retrieve
        return res.status(200).json({
          success: true,
          data: { user, accessToken },
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
      const user = await this.model.findOne({ where: { id: data.id } });

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
        user = await this.model.findOne({ where: { id: userId } });
      } else if (control === 2) {
        // 2 = join organisation
        const joinOrganisation = await this.invitation.findOne({
          where: { inviteCode },
        });

        await this.model.update(
          {
            organisationId: joinOrganisation.organisationId,
          },
          { where: { id: userId } }
        );
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
}

module.exports = AuthController;
