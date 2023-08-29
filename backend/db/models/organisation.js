"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Organisation extends Model {
    static associate(models) {
      this.hasMany(models.user);

      this.hasMany(models.organisation_admin, {
        foreignKey: "organisation_id",
      });

      this.hasMany(models.invitation);
      this.hasMany(models.tag);
      this.hasMany(models.post);
      this.hasMany(models.ketchup);
      this.hasMany(models.notification);
    }
  }
  Organisation.init(
    {
      name: DataTypes.STRING,
      time: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "organisation",
      underscored: true,
    }
  );
  return Organisation;
};
