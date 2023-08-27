"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // SECONDARY TABLE FOR USERS
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      organisation_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "organisations",
          key: "id",
        },
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false, //unique
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      profile_picture: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      email_verified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      refresh_token: {
        allowNull: true, //nullable
        type: Sequelize.TEXT,
      },
      slack_user_id: {
        allowNull: true, //nullable
        type: Sequelize.STRING,
      },
      slack_access_token: {
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

    // SECONDARY TABLE FOR INVITATIONS
    await queryInterface.createTable("invitations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      organisation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "organisations",
          key: "id",
        },
      },
      invite_code: {
        allowNull: false,
        type: Sequelize.STRING, //unique
      },
      invitee_email: {
        allowNull: false,
        type: Sequelize.STRING, //unique
      },
      is_confirmed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // SECONDARY TABLE FOR TAGS
    await queryInterface.createTable("tags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      organisation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "organisations",
          key: "id",
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("tags");
    await queryInterface.dropTable("invitations");
    await queryInterface.dropTable("users");
  },
};
