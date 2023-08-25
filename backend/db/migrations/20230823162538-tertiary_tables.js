"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // TERTIARY TABLE FOR ORGANISATION_ADMINS
    await queryInterface.createTable("organisation_admins", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      organisation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "organisations",
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // TERTIARY TABLE FOR TICKETS
    await queryInterface.createTable("tickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      creator_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      assignee_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      tag_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "tags",
          key: "id",
        },
      },
      priority_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "priorities",
          key: "id",
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      body: {
        allowNull: true, //nullable
        type: Sequelize.TEXT,
      },
      due_date: {
        allowNull: true, //nullable
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("tickets", {
      fields: ["creator_id"],
      type: "foreign key",
      name: "tickets_creator_id",
      references: {
        table: "users",
        field: "id",
      },
    });

    await queryInterface.addConstraint("tickets", {
      fields: ["assignee_id"],
      type: "foreign key",
      name: "tickets_assignee_id",
      references: {
        table: "users",
        field: "id",
      },
    });

    // TERTIARY TABLE FOR DOCUMENTS
    await queryInterface.createTable("documents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      ticket_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "tickets",
          key: "id",
        },
      },
      tag_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "tags",
          key: "id",
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      body: {
        allowNull: true, //nullable
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Drop foreign key constraints first
    await queryInterface.removeConstraint("tickets", "tickets_creator_id");
    await queryInterface.removeConstraint("tickets", "tickets_assignee_id");

    // 2. Drop tables
    await queryInterface.dropTable("documents");
    await queryInterface.dropTable("tickets");
    await queryInterface.dropTable("organisation_admins");
  },
};
