"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ===== 1: ORGANISATION_ADMIN ===== //
    await queryInterface.bulkInsert("organisation_admins", [
      {
        user_id: 1,
        organisation_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 2: TICKETS ===== //
    await queryInterface.bulkInsert("tickets", [
      {
        organisation_id: 1,
        creator_id: 1,
        assignee_id: 2,
        tag_id: 1,
        priority_id: 3,
        status_id: 3,
        name: "FE - Add Homepage",
        body: "Homepage should include daily ketchups and posts!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        creator_id: 1,
        assignee_id: 2,
        tag_id: 1,
        priority_id: 2,
        status_id: 2,
        name: "FE - Add Profile Page",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        creator_id: 1,
        assignee_id: 3,
        tag_id: 2,
        priority_id: 3,
        status_id: 3,
        name: "BE - Entity Relationship Diagram (ERD)",
        due_date: new Date(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        creator_id: 1,
        assignee_id: 3,
        tag_id: 2,
        priority_id: 2,
        status_id: 1,
        name: "BE - Implement User Authentication",
        body: "Implement user authentication using bcrypt and JWT.",
        due_date: new Date(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        creator_id: 2,
        assignee_id: 3,
        tag_id: 2,
        priority_id: 3,
        status_id: 1,
        name: "API request to retrieve user profile",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 3: TICKET_DEPENDENCIES ===== //
    await queryInterface.bulkInsert("ticket_dependencies", [
      {
        ticket_id: 4,
        dependency_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        ticket_id: 2,
        dependency_id: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 4: DOCUMENTS ===== //
    await queryInterface.bulkInsert("documents", [
      {
        organisation_id: 1,
        user_id: 3,
        tag_id: 2,
        name: "User Profile API Documentation",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 5: DOCUMENT_TICKETS ===== //
    await queryInterface.bulkInsert("document_tickets", [
      {
        ticket_id: 2,
        document_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        ticket_id: 5,
        document_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 6: WATCHERS ===== //
    await queryInterface.bulkInsert("watchers", [
      {
        user_id: 1,
        ticket_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        ticket_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 1,
        ticket_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        ticket_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 1,
        ticket_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ticket_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 1,
        ticket_id: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ticket_id: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        ticket_id: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ticket_id: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        document_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        document_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 7: POSTS ===== //
    await queryInterface.bulkInsert("posts", [
      {
        organisation_id: 1,
        user_id: 1,
        content: "Check out this new AI for crypto!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        user_id: 2,
        content:
          "Exciting news! We've just revamped our website's landing page with a fresh new look.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        user_id: 3,
        ticket_id: 4,
        content:
          "Our team is actively working to enhance the authentication system, making it more secure and user-friendly. Stay tuned for the latest improvements!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 8: KETCHUPS ===== //
    await queryInterface.bulkInsert("ketchups", [
      {
        organisation_id: 1,
        user_id: 1,
        reaction_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        user_id: 2,
        reaction_id: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        user_id: 3,
        reaction_id: 6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 9: KETCHUP_REACTIONS ===== //
    await queryInterface.bulkInsert("ketchup_reactions", [
      {
        user_id: 2,
        ketchup_id: 1,
        reaction_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ketchup_id: 1,
        reaction_id: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 1,
        ketchup_id: 2,
        reaction_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ketchup_id: 2,
        reaction_id: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        ketchup_id: 3,
        reaction_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 1,
        ketchup_id: 3,
        reaction_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 10: POST_REACTIONS ===== //
    await queryInterface.bulkInsert("post_reactions", [
      {
        user_id: 2,
        post_id: 1,
        reaction_id: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        post_id: 1,
        reaction_id: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 1,
        post_id: 2,
        reaction_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        post_id: 2,
        reaction_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 1,
        post_id: 3,
        reaction_id: 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        post_id: 3,
        reaction_id: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 11: AGENDAS ===== //
    await queryInterface.bulkInsert("agendas", [
      {
        user_id: 1,
        flag_id: 4,
        content:
          "Provide stakeholders with an overview of the wireframes for the new feature release",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        ticket_id: 1,
        flag_id: 2,
        content: "Decide on the UI components needed for the homepage",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ticket_id: 3,
        flag_id: 3,
        content: "On track to complete the ERD by the end of today",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ticket_id: 5,
        flag_id: 1,
        content:
          "Encountering issues while attempting to retrieve information for all users",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 12: KETCHUP_AGENDAS ===== //
    await queryInterface.bulkInsert("ketchup_agendas", [
      {
        ketchup_id: 1,
        agenda_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        ketchup_id: 2,
        agenda_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        ketchup_id: 3,
        agenda_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        ketchup_id: 3,
        agenda_id: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 13: UPDATES ===== //
    await queryInterface.bulkInsert("updates", [
      {
        user_id: 1,
        flag_id: 2,
        content: "Discussed key design elements and gathered initial feedback.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 2,
        ticket_id: 1,
        flag_id: 3,
        content:
          "Met with the product team to align on UI component requirements for the homepage.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 3,
        ticket_id: 5,
        document_id: 1,
        flag_id: 3,
        content:
          "Completed the initial API endpoint setup for user data retrieval.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 14: KETCHUP_UPDATES ===== //
    await queryInterface.bulkInsert("ketchup_updates", [
      {
        ketchup_id: 1,
        update_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        ketchup_id: 2,
        update_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        ketchup_id: 3,
        update_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 15: NOTIFICATIONS ===== //
    await queryInterface.bulkInsert("notifications", [
      {
        organisation_id: 1,
        user_id: 1,
        ticket_id: 2,
        type: "ticket",
        message: "An update has been added to a ticket you're following!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        user_id: 2,
        document_id: 1,
        type: "document",
        message: "An update has been added to a document you're following!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        user_id: 3,
        ketchup_id: 2,
        type: "ketchup",
        message: "An update has been added to a ketchup you're following!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notifications");
    await queryInterface.bulkDelete("ketchup_updates");
    await queryInterface.bulkDelete("updates");
    await queryInterface.bulkDelete("ketchup_agendas");
    await queryInterface.bulkDelete("agendas");
    await queryInterface.bulkDelete("post_reactions");
    await queryInterface.bulkDelete("ketchup_reactions");
    await queryInterface.bulkDelete("ketchups");
    await queryInterface.bulkDelete("posts");
    await queryInterface.bulkDelete("watchers");
    await queryInterface.bulkDelete("document_tickets");
    await queryInterface.bulkDelete("documents");
    await queryInterface.bulkDelete("ticket_dependencies");
    await queryInterface.bulkDelete("tickets");
    await queryInterface.bulkDelete("organisation_admins");
  },
};
