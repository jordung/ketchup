"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Document_Ticket extends Model {
    static associate(models) {
      this.belongsTo(models.ticket);
      this.belongsTo(models.document);
    }
  }
  Document_Ticket.init(
    {
      ticketId: DataTypes.INTEGER,
      documentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "document_ticket",
      underscored: true,
    }
  );
  return Document_Ticket;
};
