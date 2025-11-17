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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Psv",
          email: "psv@test.com",
          cart: { items: [] },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => console.log(err));
