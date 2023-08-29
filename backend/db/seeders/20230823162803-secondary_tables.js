"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ===== 1: USERS ===== //
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
      {
        organisation_id: 1,
        first_name: "Emma",
        last_name: "Willow",
        email: "emma@test.com",
        password:
          "$2y$10$gOC74MAgknDnNM5Z23JVduoRvd72oKjHaPGPSBdTvSER4Yhgqmt4q",
        profile_picture:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2488&q=80",
        email_verified: true,
        refresh_token: "",
        slack_user_id: "",
        slack_access_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        first_name: "John",
        last_name: "Swift",
        email: "john@test.com",
        password:
          "$2y$10$nB1BQE2IPJVliG9HrbarmuhrSd/EvhriuaaY61pZHBut9aokuOKNS",
        profile_picture:
          "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2732&q=80",
        email_verified: true,
        refresh_token: "",
        slack_user_id: "",
        slack_access_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 2: INVITATIONS ===== //
    await queryInterface.bulkInsert("invitations", [
      {
        organisation_id: 1,
        invite_code: "B8DM8k29",
        invitee_email: "betty@test.com",
        is_confirmed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        invite_code: "IjFjgKcC",
        invitee_email: "emma@test.com",
        is_confirmed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        organisation_id: 1,
        invite_code: "899VRTMl",
        invitee_email: "john@test.com",
        is_confirmed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 3: TAGS ===== //
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
