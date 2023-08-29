"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Organisation_Admin extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_id" });
      this.belongsTo(models.organisation, { foreignKey: "organisation_id" });
    }
  }
  Organisation_Admin.init(
    {
      userId: DataTypes.INTEGER,
      organisationId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "organisation_admin",
      underscored: true,
    }
  );
  return Organisation_Admin;
};
