const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //* Reading the cookie value
  //   let isLoggedIn = false;
  //   let cookieString = req.get("Cookie");
  //   if (cookieString) {
  //     let cookieArray = cookieString.split(";");
  //     cookieArray.forEach((cookie) => {
  //       if (cookie.includes("loggedIn")) {
  //         isLoggedIn = cookie.split("=")[1] == "true";
  //       }
  //     });
  //   }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    // For load of every page we need the user to be logged in
    // So, we check for the login status on all render() calls
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.session);

  //-> Storing a session in MongoDB.
  //? A cookie and session are mapped everytime a user logs in
  User.findById("6919cd45d0ee26caa306dc6c") // User created in MongoDB
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));

  // By default isLoggedIn will be false. Only on click of login button it will be true
  //req.isLoggedIn = true;
  //# Setting a cookie. This will be stored in the browser
  // res.setHeader("Set-Cookie", "loggedIn= true; Max-Age=10");
};

exports.postLogout = (req, res, next) => {
  console.log(req.session);
  //* After deleting the session, the user logs out and the session details are removed from the database
  // But the cookie persists in the browser so if the user logs in again the session can be mapped
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
