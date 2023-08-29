"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ketchup_Reaction extends Model {
    static associate(models) {
      this.belongsTo(models.user);
      this.belongsTo(models.ketchup);
      this.belongsTo(models.reaction);
    }
  }
  Ketchup_Reaction.init(
    {
      userId: DataTypes.INTEGER,
      ketchupId: DataTypes.INTEGER,
      reactionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ketchup_reaction",
      underscored: true,
    }
  );
  return Ketchup_Reaction;
};
