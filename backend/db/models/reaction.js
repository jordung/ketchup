"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    static associate(models) {
      this.hasMany(models.ketchup, {
        as: "mood",
        foreignKey: "reactionId",
      });

      this.hasMany(models.post_reaction);
      this.belongsToMany(models.user, { through: models.post_reaction });
      this.belongsToMany(models.post, { through: models.post_reaction });

      this.hasMany(models.ketchup_reaction);
      this.belongsToMany(models.user, { through: models.ketchup_reaction });
      this.belongsToMany(models.ketchup, { through: models.ketchup_reaction });
    }
  }
  Reaction.init(
    {
      icon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "reaction",
      underscored: true,
    }
  );
  return Reaction;
};
