"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket_Dependency extends Model {
    static associate(models) {
      this.belongsTo(models.ticket, { foreignKey: "ticket_id" });
      this.belongsTo(models.ticket, { foreignKey: "dependency_id" });
    }
  }
  Ticket_Dependency.init(
    {
      ticketId: DataTypes.INTEGER,
      dependencyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ticket_dependency",
      underscored: true,
    }
  );
  return Ticket_Dependency;
};
