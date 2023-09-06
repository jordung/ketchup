const cron = require("node-cron");
const { getIO } = require("./socket");

async function scheduleOrganisationCronJobs(adminController) {
  const io = getIO();
  const organisationsData = await adminController.getAllOrganisationTimings();
  if (organisationsData.success && organisationsData.data) {
    const organisations = organisationsData.data;
    for (const organisation of organisations) {
      const { id } = organisation.dataValues;
      // const [hours, minutes, seconds] = time.split(":").map(Number);
      // const cronExpression = `${seconds} ${minutes} ${hours} * * *`;
      const cronExpression = "0 10 * * *";
      cron.schedule(cronExpression, async () => {
        console.log(
          `Cron job for organisation ${id} executed at ${new Date()}`
        );
        io.to(`organisation_${id}`).emit("show_notification", {
          title: `Reminder to submit your Daily Ketchup by ${time}!`,
        });
      });
    }
  }
}

module.exports = { scheduleOrganisationCronJobs };
