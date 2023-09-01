const moment = require("moment");

export const formatInputDate = (inputDateString) => {
  // Parse the input date string using Moment.js
  const parsedDate = moment(
    inputDateString,
    "ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)"
  );

  // Format the parsed date in the desired ISO 8601 format
  const formattedDate = parsedDate.toISOString();

  return formattedDate;
};
