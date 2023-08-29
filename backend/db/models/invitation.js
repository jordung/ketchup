"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    static associate(models) {
      this.belongsTo(models.organisation);
    }
  }
  Invitation.init(
    {
      organisationId: DataTypes.INTEGER,
      inviteCode: {
        type: DataTypes.STRING,
        unique: true,
      },
      inviteeEmail: {
        type: DataTypes.STRING,
        unique: true,
      },
      isConfirmed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "invitation",
      underscored: true,
    }
  );
  return Invitation;
};
