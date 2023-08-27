"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ketchup_Update extends Model {
    static associate(models) {
      this.belongsTo(models.ketchup, { foreignKey: "ketchup_id" });
      this.belongsTo(models.update, { foreignKey: "update_id" });
    }
  }
  Ketchup_Update.init(
    {
      ketchupId: DataTypes.INTEGER,
      updateId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ketchup_update",
      underscored: true,
    }
  );
  return Ketchup_Update;
};
