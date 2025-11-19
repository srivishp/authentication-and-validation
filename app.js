const path = require("path");
//# Mongoose is to MongoDB what Sequelize is to SQL
//* Eases our work by letting us focus on our data and code rather than the database & its commands
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const app = express();
const User = require("./models/user");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI =
  "mongodb+srv://srivishp:Mongo2026@cluster0.1p7s5t7.mongodb.net/shop?appName=Cluster0";
//% Package to prevent CSRF attacks
const csrf = require("csurf");
const csrfProtection = csrf();
//% Package to display flash messages to users upon redirection or login/sign up etc
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//> CSRF middleware must be initialized after the session middlewar, as it requires the session
app.use(csrfProtection);
// Using the flash message middleware
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id) // Find the user in the database using the user model provided by mongoose
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  //% Implementing isAuthenticated & CSRF token in one place
  // For load of every page we need the user to be logged in
  // So, we check for the login status on all render() calls
  //* Express JS feature which allows the use of local variables in the views
  (res.locals.isAuthenticated = req.session.isLoggedIn),
    //# For CSRF tokens to work on POST requests, the token must be present in the views first.
    // So we are adding it here first, as this is the landing page where we click log out
    //? csrfToken() is provided by the package
    (res.locals.csrfToken = req.csrfToken());
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
