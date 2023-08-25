"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        organisation_id: 1,
        first_name: "Betty",
        last_name: "Evermore",
        email: "betty@test.com",
        password:
          "$2y$10$2i1kXfilmyw5jl25e9kaXOsUsSZsqzFah9R1xS7F/9TN1pwg64f9u",
        profile_picture:
          "https://images.unsplash.com/photo-1675027517056-4b43a2b39a9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80",
        email_verified: true,
        refresh_token: "",
        slack_user_id: "",
        slack_access_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    await queryInterface.bulkInsert("invitations", [
      {
        organisation_id: 1,
        invite_code: "kdWAfQ0F",
        invitee_email: "betty@test.com",
        is_confirmed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    await queryInterface.bulkInsert("tags", [
      {
        organisation_id: 1,
        name: "#frontend",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        name: "#backend",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tags");
    await queryInterface.bulkDelete("invitations");
    await queryInterface.bulkDelete("users");
  },
};
