const startDate = () => {
  const today = new Date();
  // set time to the beginning of the day
  today.setHours(0, 0, 0, 0);
  return today;
};

const endDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};

module.exports = { startDate, endDate };
