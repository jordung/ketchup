const cors = require("cors");
const express = require("express");
require("dotenv").config();

// Import middlewares
const jwtAuth = require("./middlewares/jwtAuth");

// importing routers
const UserProfileRouter = require("./routers/userProfileRouter");
const AuthRouter = require("./routers/authRouter");
const AdminRouter = require("./routers/adminRouter");
const InvitationRouter = require("./routers/invitationRouter");
const HomeRouter = require("./routers/homeRouter");
const DailyKetchupRouter = require("./routers/dailyKetchupRouter");
const AllKetchupsRouter = require("./routers/allKetchupsRouter");
const TicketRouter = require("./routers/ticketRouter");
const DocumentRouter = require("./routers/documentRouter");
const WatchlistRouter = require("./routers/watchlistRouter");

// importing Controllers
const UserProfileController = require("./controllers/userProfileController");
const AuthController = require("./controllers/authController");
const AdminController = require("./controllers/adminController");
const InvitationController = require("./controllers/invitationController");
const HomeController = require("./controllers/homeController");
const DailyKetchupController = require("./controllers/dailyKetchupController");
const AllKetchupsController = require("./controllers/allKetchupsController");
const TicketController = require("./controllers/ticketController");
const DocumentController = require("./controllers/documentController");
const WatchlistController = require("./controllers/watchlistController");

// importing DB
const db = require("./db/models/index");
const {
  user,
  organisation,
  invitation,
  organisation_admin,
  priority,
  flag,
  reaction,
  tag,
  status,
  ticket,
  ticket_dependency,
  document,
  document_ticket,
  watcher,
  post,
  post_reaction,
  ketchup,
  ketchup_reaction,
  agenda,
  ketchup_agenda,
  update,
  ketchup_update,
  notification,
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
  watcher,
});

const adminController = new AdminController({
  user,
  invitation,
  organisation,
  organisation_admin,
});

const invitationController = new InvitationController({
  user,
  invitation,
  organisation,
  organisation_admin,
});

const homeController = new HomeController({
  user,
  organisation,
  flag,
  reaction,
  ticket,
  document,
  post,
  post_reaction,
  ketchup,
  ketchup_reaction,
  agenda,
  ketchup_agenda,
  update,
  ketchup_update,
});

const dailyKetchupController = new DailyKetchupController({
  user,
  organisation,
  flag,
  reaction,
  ticket,
  document,
  post,
  post_reaction,
  ketchup,
  ketchup_reaction,
  agenda,
  ketchup_agenda,
  update,
  ketchup_update,
});

const allketchupsController = new AllKetchupsController({
  user,
  organisation,
  flag,
  reaction,
  ticket,
  document,
  ketchup,
  ketchup_reaction,
  agenda,
  ketchup_agenda,
  update,
  ketchup_update,
  notification,
});

const ticketController = new TicketController({
  user,
  organisation,
  tag,
  priority,
  status,
  ticket,
  ticket_dependency,
  document,
  document_ticket,
  post,
  watcher,
  agenda,
  update,
  notification,
});

const documentController = new DocumentController({
  user,
  organisation,
  tag,
  ticket,
  document,
  document_ticket,
  watcher,
  agenda,
  update,
  notification,
});

const watchlistController = new WatchlistController({
  user,
  ticket,
  document,
  watcher,
  notification,
});

// initialising routers
//TODO: rmb to pass jwtAuth in protected routes
const userProfileRouter = new UserProfileRouter(
  userProfileController,
  jwtAuth
).routes();

const authRouter = new AuthRouter(authController).routes();
const adminRouter = new AdminRouter(adminController).routes();
const invitationRouter = new InvitationRouter(invitationController).routes();
const homeRouter = new HomeRouter(homeController).routes();
const dailyKetchupRouter = new DailyKetchupRouter(
  dailyKetchupController
).routes();
const allketchupsRouter = new AllKetchupsRouter(allketchupsController).routes();
const ticketRouter = new TicketRouter(ticketController).routes();
const documentRouter = new DocumentRouter(documentController).routes();
const watchlistRouter = new WatchlistRouter(watchlistController).routes();

const PORT = process.env.PORT;
const app = express();

// enable CORS access to this server
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// using the routers
app.use("/users", userProfileRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/invite", invitationRouter);
app.use("/home", homeRouter);
app.use("/daily", dailyKetchupRouter);
app.use("/ketchups", allketchupsRouter);
app.use("/tickets", ticketRouter);
app.use("/documents", documentRouter);
app.use("/watch", watchlistRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
