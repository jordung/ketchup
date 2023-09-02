"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      this.belongsTo(models.organisation);
      this.belongsTo(models.user, { as: "creator", foreignKey: "creatorId" });
      this.belongsTo(models.user, {
        as: "assignee",
        foreignKey: "assigneeId",
      });

      this.belongsTo(models.tag);
      this.belongsTo(models.priority);
      this.belongsTo(models.status);

      this.hasMany(models.post);
      this.hasMany(models.agenda);
      this.hasMany(models.update);

      this.hasMany(models.ticket_dependency);
      this.belongsToMany(models.ticket, {
        through: models.ticket_dependency,
        as: "ticket",
        foreignKey: "ticketId",
      });
      this.belongsToMany(models.ticket, {
        through: models.ticket_dependency,
        as: "dependency",
        foreignKey: "dependencyId",
      });

      this.hasMany(models.document_ticket);
      this.belongsToMany(models.document, { through: models.document_ticket });

      this.hasMany(models.watcher);
      this.belongsToMany(models.user, { through: models.watcher });

      this.hasMany(models.notification);
      this.belongsToMany(models.user, { through: models.notification });
    }
  }
  Ticket.init(
    {
      organisationId: DataTypes.INTEGER,
      creatorId: DataTypes.INTEGER,
      assigneeId: DataTypes.INTEGER,
      tagId: DataTypes.INTEGER,
      priorityId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      body: DataTypes.TEXT,
      dueDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ticket",
      underscored: true,
    }
  );
  return Ticket;
};
