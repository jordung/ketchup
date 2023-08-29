"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post_Reaction extends Model {
    static associate(models) {
      this.belongsTo(models.user);
      this.belongsTo(models.post);
      this.belongsTo(models.reaction);
    }
  }
  Post_Reaction.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
      reactionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "post_reaction",
      underscored: true,
    }
  );
  return Post_Reaction;
};
