"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    static associate(models) {
      this.belongsTo(models.user, { as: "creator", foreignKey: "userId" });
      this.belongsTo(models.ticket);
      this.belongsTo(models.document);
      this.belongsTo(models.flag);
      this.hasOne(models.ketchup_agenda, { foreignKey: "agendaId" });
    }
  }
  Agenda.init(
    {
      userId: DataTypes.INTEGER,
      ticketId: DataTypes.INTEGER,
      documentId: DataTypes.INTEGER,
      flagId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "agenda",
      underscored: true,
    }
  );
  return Agenda;
};
