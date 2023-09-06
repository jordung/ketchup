const socketIO = require("socket.io");

function socket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "https://theketchupcorner.netlify.app",
      allowedHeaders: ["Access-Control-Allow-Origin"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("initialisation", function (data) {
      if (data) {
        console.log("User has subscribed to", `user_${data.userId}`);
        console.log(
          "User has subscribed to",
          `organisation_${data.organisationId}`
        );
        socket.join(`user_${data.userId}`);
        socket.join(`organisation_${data.organisationId}`);
      }
    });

    socket.on("assignee", function (data) {
      console.log("assigneeId", data);
      io.to(`user_${data.target}`).emit("show_notification", {
        title: data.title,
      });
    });

    socket.on("new_joiner", function (data) {
      console.log("new_joiner", data);
      socket.to(`organisation_${data.target}`).emit("user_join_notification", {
        title: data.title,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}

module.exports = socket;
