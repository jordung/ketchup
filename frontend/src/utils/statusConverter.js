export const statusConverter = (statusId) => {
  switch (statusId) {
    case 1:
      return "Not Started";

    case 2:
      return "In Progress";

    case 3:
      return "Completed";

    default:
      return "NIL";
  }
};
