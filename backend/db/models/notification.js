"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      this.belongsTo(models.organisation);
      this.belongsTo(models.user);
      this.belongsTo(models.ticket);
      this.belongsTo(models.ketchup);
      this.belongsTo(models.document);
    }
  }
  Notification.init(
    {
      organisationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      ketchupId: DataTypes.INTEGER,
      ticketId: DataTypes.INTEGER,
      documentId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "notification",
      underscored: true,
    }
  );
  return Notification;
};
