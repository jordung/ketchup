"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Priority extends Model {
    static associate(models) {
      this.hasMany(models.ticket);
    }
  }
  Priority.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "priority",
      underscored: true,
    }
  );
  return Priority;
};
