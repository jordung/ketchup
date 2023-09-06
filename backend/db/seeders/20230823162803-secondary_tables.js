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
          "https://firebasestorage.googleapis.com/v0/b/ketchup-e53a7.appspot.com/o/profile%2F6809f6ff-60d2-4e75-9cb2-f9333661f8af?alt=media&token=39553972-f32e-424f-ace5-9dc8d489346c",
        email_verified: true,
        refresh_token: "",
        slack_team_id: "",
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
          "https://firebasestorage.googleapis.com/v0/b/ketchup-e53a7.appspot.com/o/profile%2Fc126932c-b1c0-4af8-a4db-a28fce3f3b6b?alt=media&token=08521c74-25e7-4e0f-94ac-3c9e97ab62c4",
        email_verified: true,
        refresh_token: "",
        slack_team_id: "",
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
          "https://firebasestorage.googleapis.com/v0/b/ketchup-e53a7.appspot.com/o/profile%2F2ad35aa9-f823-435e-a3c1-c4c41d3da07f?alt=media&token=c4b639c1-19be-4450-80e3-c56f1742f613",
        email_verified: true,
        refresh_token: "",
        slack_team_id: "",
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
