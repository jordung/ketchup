export const priorityConverter = (priorityId) => {
  switch (priorityId) {
    case 1:
      return "Low";

    case 2:
      return "Medium";

    case 3:
      return "High";

    default:
      return "NIL";
  }
};
