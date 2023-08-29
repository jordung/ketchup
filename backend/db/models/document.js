"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      this.belongsTo(models.user, { as: "creator", foreignKey: "user_id" });
      this.belongsTo(models.tag);

      this.hasMany(models.agenda);
      this.hasMany(models.update);

      this.hasMany(models.watcher);
      this.belongsToMany(models.user, { through: models.watcher });

      this.hasMany(models.document_ticket);
      this.belongsToMany(models.ticket, { through: models.document_ticket });

      this.hasMany(models.notification);
      this.belongsToMany(models.user, { through: models.notification });
    }
  }
  Document.init(
    {
      userId: DataTypes.INTEGER,
      tagId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "document",
      underscored: true,
    }
  );
  return Document;
};
