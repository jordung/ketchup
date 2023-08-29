const cors = require("cors");
const express = require("express");
require("dotenv").config();

// Import middlewares
const jwtAuth = require("./middlewares/jwtAuth");

// importing routers
const UserProfileRouter = require("./routers/userProfileRouter");
const AuthRouter = require("./routers/authRouter");
const InvitationRouter = require("./routers/invitationRouter");
const KetchupRouter = require("./routers/ketchupRouter");

// importing Controllers
const UserProfileController = require("./controllers/userProfileController");
const AuthController = require("./controllers/authController");
const InvitationController = require("./controllers/invitationController");
const KetchupController = require("./controllers/ketchupControllers");

// importing DB
const db = require("./db/models/index");
const {
  user,
  organisation,
  invitation,
  organisation_admin,
  // priority,
  flag,
  reaction,
  // tag,
  ticket,
  // ticket_dependency,
  document,
  // document_ticket,
  watcher,
  // post,
  // post_reaction,
  ketchup,
  ketchup_reaction,
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

const authController = new AuthController({
  user,
  organisation,
  invitation,
  organisation_admin,
});

const invitationController = new InvitationController({
  user,
  invitation,
  organisation,
  organisation_admin,
});

const ketchupController = new KetchupController({
  user,
  organisation,
  flag,
  reaction,
  ticket,
  document,
  ketchup,
  ketchup_reaction,
});

// initialising routers
//TODO: rmb to pass jwtAuth in protected routes
const userProfileRouter = new UserProfileRouter(
  userProfileController,
  jwtAuth
).routes();

const authRouter = new AuthRouter(authController).routes();
const invitationRouter = new InvitationRouter(invitationController).routes();
const ketchupRouter = new KetchupRouter(ketchupController).routes();

const PORT = process.env.PORT;
const app = express();

// enable CORS access to this server
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// using the routers
app.use("/users", userProfileRouter);
app.use("/auth", authRouter);
app.use("/invite", invitationRouter);
app.use("/ketchup", ketchupRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
