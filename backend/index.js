const cors = require("cors");
const express = require("express");

require("dotenv").config();

// importing routers
const UserProfileRouter = require("./routers/userProfileRouter");

// importing Controllers
const UserProfileController = require("./controllers/userProfileController");

// importing DB
const db = require("./db/models/index");
const {
  user,
  organisation,
  // invitation,
  // organisation_admin,
  // priority,
  // flag,
  // reaction,
  // tag,
  // ticket,
  // ticket_dependency,
  // document,
  // document_ticket,
  // watcher,
  // post,
  // post_reaction,
  // ketchup,
  // ketchup_reaction,
  // agenda,
  // ketchup_agenda,
  // update,
  // ketchup_update,
  // notification,
} = db;

// initialising controllers -> note the lowercase for the first word
const userProfileController = new UserProfileController({
  user,
  organisation,
});

// initialising routers
const userProfileRouter = new UserProfileRouter(userProfileController).routes();

const PORT = process.env.PORT;
const app = express();

// enable CORS access to this server
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// using the routers
app.use("/users", userProfileRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
