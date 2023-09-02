"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Organisation extends Model {
    static associate(models) {
      this.hasMany(models.user);

      this.hasMany(models.organisation_admin, {
        foreignKey: "organisationId",
      });

      this.hasMany(models.invitation);
      this.hasMany(models.tag);
      this.hasMany(models.post);
      this.hasMany(models.ketchup);
      this.hasMany(models.ticket);
      this.hasMany(models.document);
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
