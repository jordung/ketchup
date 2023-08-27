class BaseController {
  constructor(model) {
    this.model = model;
  }
  // all controllers that extend this BASE controller will have access to the below function

  async getAllUsers(req, res) {
    try {
      let result = await this.model.findAll();
      return res.status(200).json({
        success: true,
        data: result,
        msg: "Success: retrieved data for all users on Ketchup!",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: "Error: unable to retrieve data for all users.",
      });
    }
  }
}

module.exports = BaseController;
