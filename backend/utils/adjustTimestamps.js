const adjustTimestamps = (data) => {
  // adjust timestamps to GMT+8 by adding 8 hours in milliseconds
  data.forEach((item) => {
    console.log("item.dataValues.createdAt", item.dataValues.createdAt);

    console.log(
      "item.dataValues.createdAt formatted",
      new Date(item.dataValues.createdAt.getTime() + 8 * 60 * 60 * 1000)
    );
    item.dataValues.createdAt = new Date(
      item.dataValues.createdAt.getTime() + 8 * 60 * 60 * 1000
    );
    item.dataValues.updatedAt = new Date(
      item.dataValues.updatedAt.getTime() + 8 * 60 * 60 * 1000
    );
    return data;
  });
};

module.exports = { adjustTimestamps };
