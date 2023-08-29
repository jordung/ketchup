"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Watcher extends Model {
    static associate(models) {
      this.belongsTo(models.user);
      this.belongsTo(models.ticket);
      this.belongsTo(models.document);
    }
  }
  Watcher.init(
    {
      userId: DataTypes.INTEGER,
      ticketId: DataTypes.INTEGER,
      documentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "watcher",
      underscored: true,
    }
  );
  return Watcher;
};
