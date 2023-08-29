"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flag extends Model {
    static associate(models) {
      this.hasMany(models.agenda);
      this.hasMany(models.update);
    }
  }
  Flag.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "flag",
      underscored: true,
    }
  );
  return Flag;
};
