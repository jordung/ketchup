// calculate the total number of times the emoji has been reacted to by different users in response to the ketchups/posts

// object: [ {"icon": "unicode", "userId": [1, 2,3]} ]
const getAllReactions = (items, table) => {
  const reactionsWithItems = [];
  // console.log("1: reactionsWithItems", reactionsWithItems);

  items.forEach((item) => {
    // const itemId = item.dataValues.id;
    // console.log("2: itemId", itemId);
    const groupedReactions = [];
    // console.log("3: groupedReactions", groupedReactions);

    item[table].forEach((model) => {
      const icon = model.dataValues.reaction.icon;
      const userId = model.dataValues.userId;

      const newReaction = {
        icon: icon,
        userId: [userId],
      };
      // Check if an object with the same id already exists
      const existingReaction = groupedReactions.find(
        (item) => item.icon === icon
      );
      if (existingReaction) {
        // Append the userId to the existing userId array
        existingReaction.userId.push(userId);
      } else {
        // Add a new object to the array
        groupedReactions.push(newReaction);
      }
    });
    // console.log("8: groupedReactions", groupedReactions);

    reactionsWithItems.push({
      ...item.toJSON(),
      groupedReactions,
    });
  });

  return reactionsWithItems;
};

module.exports = { getAllReactions };
