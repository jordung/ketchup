"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      this.belongsTo(models.organisation);
      this.hasMany(models.ticket);
      this.hasMany(models.document);
    }
  }
  Tag.init(
    {
      organisationId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tag",
      underscored: true,
    }
  );
  return Tag;
};
