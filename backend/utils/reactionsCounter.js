// calculate the total number of times the emoji has been reacted to by different users in response to the ketchups/posts

const reactionsCounter = (items, table) => {
  // step 1: initialise object to store reaction for each ketchup/post
  const reactionsObject = {};

  // step 2: iterates through each ketchup/post to get ketchup.id/post.id
  items.forEach((item) => {
    const itemId = item.id;

    // step 3: iterates through the current ketchup/post to retrieve all reactions (includ. userId and icon) it has received
    item[table].forEach((reaction) => {
      const {
        userId,
        reaction: { icon },
      } = reaction;

      // step 4: to check if ketchupId/postId exists in reactionsObject; return empty object if not found
      if (!reactionsObject[itemId]) {
        reactionsObject[itemId] = {};
      }

      // step 5: then, check if the reaction icon already exists within the object; return empty array if not found
      if (!reactionsObject[itemId][icon]) {
        reactionsObject[itemId][icon] = [];
      }

      // step 6: finally, check if userId exists in the array relating to that specific reaction for that ketchup/post, otherwise, add userId to the array
      if (!reactionsObject[itemId][icon].includes(userId)) {
        reactionsObject[itemId][icon].push(userId);
      }
    });
  });

  // iterates through reactionsObject and include 'reactionCounts' to store the total number of times the emoji has been reacted to by different users in response to the ketchups/posts
  return items.map((item) => {
    const reactionCounts = {};

    // loop through ketchup/post and retrieve the 'icon' for each reaction it receives
    item[table].forEach((reaction) => {
      const { icon } = reaction.reaction;

      // check if an entry for that retrieved 'icon' exists, otherwise, initialise an object for the icon and a users array to include users who have reacted with the same icon
      if (!reactionCounts[icon]) {
        reactionCounts[icon] = {
          icon,
          // if null, return [], else return the array of userIds stored in the reactionsObject
          users: reactionsObject[item.id]?.[icon] || [],
        };
      }
    });

    return {
      ...item.toJSON(),
      reactionCounts: Object.values(reactionCounts),
    };
  });
};

module.exports = reactionsCounter;

// const ketchupReactions = {};
// ketchups.forEach((ketchup) => {
//   const ketchupId = ketchup.id;

//   ketchup.ketchup_reactions.forEach((reaction) => {
//     const {
//       userId,
//       reaction: { icon },
//     } = reaction;

//     if (!ketchupReactions[ketchupId]) {
//       ketchupReactions[ketchupId] = {};
//     }

//     if (!ketchupReactions[ketchupId][icon]) {
//       ketchupReactions[ketchupId][icon] = [];
//     }

//     if (!ketchupReactions[ketchupId][icon].includes(userId)) {
//       ketchupReactions[ketchupId][icon].push(userId);
//     }
//   });
// });
// console.log("ketchupReactions", ketchupReactions);

// const dailyKetchups = ketchups.map((ketchup) => {
//   const reactionCounts = {};

//   ketchup.ketchup_reactions.forEach((reaction) => {
//     const { icon } = reaction.reaction;

//     if (!reactionCounts[icon]) {
//       reactionCounts[icon] = {
//         icon,
//         users: ketchupReactions[ketchup.id]?.[icon] || [],
//       };
//     }
//   });
//   return {
//     ...ketchup.toJSON(),
//     reactionCounts: Object.values(reactionCounts),
//   };
// });
