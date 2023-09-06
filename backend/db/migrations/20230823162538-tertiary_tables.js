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
      organisation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "organisations",
          key: "id",
        },
      },
      creator_id: {
        allowNull: true,
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
      status_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "statuses",
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

    // TERTIARY TABLE FOR TICKET_DEPENDENCIES
    await queryInterface.createTable("ticket_dependencies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ticket_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tickets",
          key: "id",
        },
      },
      dependency_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tickets",
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

    await queryInterface.addConstraint("ticket_dependencies", {
      fields: ["dependency_id"],
      type: "foreign key",
      name: "ticket_dependencies_dependency_id",
      references: {
        table: "tickets",
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
      organisation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "organisations",
          key: "id",
        },
      },
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "users", //alias = creator
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

    // TERTIARY TABLE FOR DOCUMENT_TICKETS
    await queryInterface.createTable("document_tickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ticket_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tickets",
          key: "id",
        },
      },
      document_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
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

    // TERTIARY TABLE FOR WATCHERS
    await queryInterface.createTable("watchers", {
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
      document_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
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

    // TERTIARY TABLE FOR POSTS
    await queryInterface.createTable("posts", {
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
      user_id: {
        allowNull: true,
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
      content: {
        allowNull: false,
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

    // TERTIARY TABLE FOR KETCHUPS
    await queryInterface.createTable("ketchups", {
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
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "users", //alias = creator
          key: "id",
        },
      },
      reaction_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "reactions",
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

    // TERTIARY TABLE FOR KETCHUP_REACTIONS
    await queryInterface.createTable("ketchup_reactions", {
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
      ketchup_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "ketchups",
          key: "id",
        },
      },
      reaction_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "reactions",
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

    // TERTIARY TABLE FOR POST_REACTIONS
    await queryInterface.createTable("post_reactions", {
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
      post_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "posts",
          key: "id",
        },
      },
      reaction_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "reactions",
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

    // TERTIARY TABLE FOR AGENDAS
    await queryInterface.createTable("agendas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "users", //alias = creator
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
      document_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id",
        },
      },
      flag_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "flags",
          key: "id",
        },
      },
      content: {
        allowNull: false,
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

    // TERTIARY TABLE FOR KETCHUP_AGENDAS
    await queryInterface.createTable("ketchup_agendas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ketchup_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "ketchups",
          key: "id",
        },
      },
      agenda_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "agendas",
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

    // TERTIARY TABLE FOR UPDATES
    await queryInterface.createTable("updates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "users", //alias = creator
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
      document_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id",
        },
      },
      flag_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "flags",
          key: "id",
        },
      },
      content: {
        allowNull: false,
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

    // TERTIARY TABLE FOR KETCHUP_UPDATES
    await queryInterface.createTable("ketchup_updates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ketchup_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "ketchups",
          key: "id",
        },
      },
      update_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "updates",
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

    // TERTIARY TABLE FOR NOTIFICATIONS
    await queryInterface.createTable("notifications", {
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
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      ketchup_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "ketchups",
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
      document_id: {
        allowNull: true, //nullable
        type: Sequelize.INTEGER,
        references: {
          model: "documents",
          key: "id",
        },
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      message: {
        allowNull: false,
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
    await queryInterface.removeConstraint(
      "ticket_dependencies",
      "ticket_dependencies_dependency_id"
    );
    await queryInterface.removeConstraint("tickets", "tickets_creator_id");
    await queryInterface.removeConstraint("tickets", "tickets_assignee_id");

    // 2. Drop tables
    await queryInterface.dropTable("notifications");
    await queryInterface.dropTable("ketchup_updates");
    await queryInterface.dropTable("updates");
    await queryInterface.dropTable("ketchup_agendas");
    await queryInterface.dropTable("agendas");
    await queryInterface.dropTable("post_reactions");
    await queryInterface.dropTable("ketchup_reactions");
    await queryInterface.dropTable("ketchups");
    await queryInterface.dropTable("posts");
    await queryInterface.dropTable("watchers");
    await queryInterface.dropTable("document_tickets");
    await queryInterface.dropTable("documents");
    await queryInterface.dropTable("ticket_dependencies");
    await queryInterface.dropTable("tickets");
    await queryInterface.dropTable("organisation_admins");
  },
};
