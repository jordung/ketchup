"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ketchup extends Model {
    static associate(models) {
      this.belongsTo(models.organisation);
      this.belongsTo(models.user, { as: "creator", foreignKey: "user_id" });
      this.belongsTo(models.reaction);

      this.hasMany(models.ketchup_agenda, { foreignKey: "ketchup_id" });
      this.hasMany(models.ketchup_update, { foreignKey: "ketchup_id" });

      this.hasMany(models.ketchup_reaction);
      this.belongsToMany(models.user, { through: models.ketchup_reaction });
      this.belongsToMany(models.reaction, { through: models.ketchup_reaction });

      this.hasMany(models.notification);
      this.belongsToMany(models.user, { through: models.notification });
    }
  }
  Ketchup.init(
    {
      organisationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      reactionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ketchup",
      underscored: true,
    }
  );
  return Ketchup;
};
