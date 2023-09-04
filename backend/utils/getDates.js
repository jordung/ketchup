const startDate = () => {
  const today = new Date();
  // set time to the beginning of the day
  today.setUTCHours(-8, 0, 0, 0);
  today.setHours(today.getHours() + 8);
  console.log("today", today);
  return today;
};

const endDate = () => {
  const today = new Date();
  today.setUTCHours(-8, 0, 0, 0);
  today.setHours(today.getHours() + 8);

  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + 1);
  console.log("nextDate", nextDate);
  return nextDate;
};

module.exports = { startDate, endDate };
