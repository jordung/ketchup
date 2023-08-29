"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.belongsTo(models.organisation);
      this.belongsTo(models.user);
      this.belongsTo(models.ticket);

      this.hasMany(models.post_reaction);
      this.belongsToMany(models.user, { through: models.post_reaction });
      this.belongsToMany(models.reaction, { through: models.post_reaction });
    }
  }
  Post.init(
    {
      organisationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      ticketId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "post",
      underscored: true,
    }
  );
  return Post;
};
