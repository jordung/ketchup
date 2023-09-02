"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ketchup_Agenda extends Model {
    static associate(models) {
      this.belongsTo(models.ketchup, { foreignKey: "ketchupId" });
      this.belongsTo(models.agenda, { foreignKey: "agendaId" });
    }
  }
  Ketchup_Agenda.init(
    {
      ketchupId: DataTypes.INTEGER,
      agendaId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ketchup_agenda",
      underscored: true,
    }
  );
  return Ketchup_Agenda;
};
