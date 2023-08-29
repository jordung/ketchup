"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      this.hasMany(models.ticket);
    }
  }
  Status.init(
    {
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = "Not Started"
      },
    },
    {
      sequelize,
      modelName: "status",
      underscored: true,
    }
  );
  return Status;
};
