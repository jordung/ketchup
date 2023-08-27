"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Update extends Model {
    static associate(models) {
      this.belongsTo(models.user, { as: "creator", foreignKey: "user_id" });
      this.belongsTo(models.ticket);
      this.belongsTo(models.document);
      this.belongsTo(models.flag);
      this.belongsTo(models.ketchup_update, { foreignKey: "update_id" });
    }
  }
  Update.init(
    {
      userId: DataTypes.INTEGER,
      ticketId: DataTypes.INTEGER,
      documentId: DataTypes.INTEGER,
      flagId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "update",
      underscored: true,
    }
  );
  return Update;
};
