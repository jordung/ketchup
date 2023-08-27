"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.organisation);

      this.belongsTo(models.organisation_admin, { foreignKey: "user_id" });

      this.hasMany(models.post);
      this.hasMany(models.agenda, { as: "creator", foreignKey: "user_id" });
      this.hasMany(models.update, { as: "creator", foreignKey: "user_id" });
      this.hasMany(models.ketchup, { as: "creator", foreignKey: "user_id" });
      this.hasMany(models.document, { as: "creator", foreignKey: "user_id" });

      this.hasMany(models.ticket, { as: "creator", foreignKey: "creator_id" });
      this.hasMany(models.ticket, {
        as: "assignee",
        foreignKey: "assignee_id",
      });

      this.hasMany(models.post_reaction);
      this.belongsToMany(models.post, { through: models.post_reaction });
      this.belongsToMany(models.reaction, { through: models.post_reaction });

      this.hasMany(models.ketchup_reaction);
      this.belongsToMany(models.ketchup, { through: models.ketchup_reaction });
      this.belongsToMany(models.reaction, {
        through: models.ketchup_reaction,
      });

      this.hasMany(models.watcher);
      this.belongsToMany(models.ticket, { through: models.watcher });
      this.belongsToMany(models.document, { through: models.watcher });

      this.hasMany(models.notification);
      this.belongsToMany(models.ticket, { through: models.notification });
      this.belongsToMany(models.ketchup, { through: models.notification });
      this.belongsToMany(models.document, { through: models.notification });
    }
  }
  User.init(
    {
      organisationId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      profilePicture: DataTypes.TEXT,
      emailVerified: DataTypes.BOOLEAN,
      refreshToken: DataTypes.TEXT,
      slackUserId: DataTypes.STRING,
      slackAccessToken: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return User;
};
