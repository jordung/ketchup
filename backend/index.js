const cors = require("cors");
const express = require("express");
require("dotenv").config();

// Import middlewares
const jwtAuth = require("./middlewares/jwtAuth");

// importing routers
const UserProfileRouter = require("./routers/userProfileRouter");
const AuthRouter = require("./routers/authRouter");

// importing Controllers
const UserProfileController = require("./controllers/userProfileController");
const AuthController = require("./controllers/authController");

// importing DB
const db = require("./db/models/index");
const {
  user,
  organisation,
  invitation,
  // organisation_admin,
  // priority,
  // flag,
  // reaction,
  // tag,
  ticket,
  // ticket_dependency,
  document,
  // document_ticket,
  watcher,
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
  ticket,
  document,
  watcher,
});

const authController = new AuthController({ user, organisation, invitation });

// initialising routers
//TODO: rmb to pass jwtAuth in protected routes
const userProfileRouter = new UserProfileRouter(
  userProfileController,
  jwtAuth
).routes();
const authRouter = new AuthRouter(authController).routes();

const PORT = process.env.PORT;
const app = express();

// enable CORS access to this server
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// using the routers
app.use("/users", userProfileRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
