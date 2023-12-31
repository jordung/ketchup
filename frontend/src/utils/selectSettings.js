export const tagDefaultOptions = [
  { value: 1, label: "Frontend" },
  { value: 2, label: "Backend" },
  { value: 3, label: "Bugfix" },
  { value: 4, label: "Feature" },
];

export const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: "0.5rem",
    cursor: "pointer",
    boxShadow: "none",
    borderColor: "#E0DFE1",
    "&:hover": {
      borderColor: "#E0DFE1",
    },
  }),
  option: (styles, { isDisabled, isFocused }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#F6F6F6" : "white",
      color: isDisabled ? "#E0DFE1" : "#353535",
      cursor: isDisabled ? "" : "pointer",
    };
  },
};

export const userPermissions = [
  { value: true, label: "Admin" },
  { value: false, label: "Member" },
];

export const timeIntervals = [
  { value: "08:00:00", label: "08:00" },
  { value: "08:30:00", label: "08:30" },
  { value: "09:00:00", label: "09:00" },
  { value: "09:30:00", label: "09:30" },
  { value: "10:00:00", label: "10:00" },
  { value: "10:30:00", label: "10:30" },
  { value: "11:00:00", label: "11:00" },
  { value: "11:30:00", label: "11:30" },
  { value: "12:00:00", label: "12:00" },
  { value: "12:30:00", label: "12:30" },
  { value: "13:00:00", label: "13:00" },
  { value: "13:30:00", label: "13:30" },
  { value: "14:00:00", label: "14:00" },
  { value: "14:30:00", label: "14:30" },
  { value: "15:00:00", label: "15:00" },
  { value: "15:30:00", label: "15:30" },
  { value: "16:00:00", label: "16:00" },
  { value: "16:30:00", label: "16:30" },
  { value: "17:00:00", label: "17:00" },
  { value: "17:30:00", label: "17:30" },
  { value: "18:00:00", label: "18:00" },
  { value: "18:30:00", label: "18:30" },
  { value: "19:00:00", label: "19:00" },
];
