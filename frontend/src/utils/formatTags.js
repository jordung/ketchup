export const formatTags = (arr) => {
  return arr.map((item) => ({ label: item.name, value: item.id }));
};

export const formatOneTag = (object) => {
  return { label: object.name, value: object.id };
};
