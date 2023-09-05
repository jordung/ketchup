const moment = require("moment-timezone");

const startDate = () => {
  const today = moment().tz("Asia/Singapore").startOf("day");
  return today.toDate();
};

const endDate = () => {
  const today = moment().tz("Asia/Singapore").endOf("day");
  return today.toDate();
};

module.exports = { startDate, endDate };
