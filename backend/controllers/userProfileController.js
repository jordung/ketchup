const BaseController = require("./baseController");

class UserProfileController extends BaseController {
  constructor({ user, organisation }) {
    super(user);
    this.user = user;
    this.organisation = organisation;
  }
}

module.exports = UserProfileController;
