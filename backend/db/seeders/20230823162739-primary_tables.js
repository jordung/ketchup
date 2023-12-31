"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ===== 1: ORGANISATIONS ===== //
    await queryInterface.bulkInsert("organisations", [
      {
        name: "Handshake",
        time: "10:00",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 2: PRIORITIES ===== //
    await queryInterface.bulkInsert("priorities", [
      {
        name: "Low",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "Medium",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "High",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 3: FLAGS ===== //
    await queryInterface.bulkInsert("flags", [
      {
        name: "help",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "all's good",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "fyi",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "urgent",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 4: REACTIONS ===== //
    await queryInterface.bulkInsert("reactions", [
      {
        icon: "1F606",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F609",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F92A",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F617",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F642",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F972",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F92F",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F971",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        icon: "1F927",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    // ===== 5: STATUSES ===== //
    await queryInterface.bulkInsert("statuses", [
      {
        name: "Not Started",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "In Progress",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "Completed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("statuses");
    await queryInterface.bulkDelete("reactions");
    await queryInterface.bulkDelete("flags");
    await queryInterface.bulkDelete("priorities");
    await queryInterface.bulkDelete("organisations");
  },
};
