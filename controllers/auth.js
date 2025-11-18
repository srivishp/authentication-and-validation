const User = require("../models/user");
//% Package to encrypt data
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //* Finding a user by their email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      //* Validating the password
      //> Passing the password into bcrypt and it compares it to the hashed value
      //# bcrypt.compare() returns a promise
      // Comparing the user entered password with the existing one in the database
      bcrypt
        .compare(password, user.password)
        .then((isMatching) => {
          if (isMatching) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  console.log(req.session);
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      return res.redirect("/signup");
    }
    //> Using bcrypt to hash a password with salt number 12
    //* Larger the salt number, longer it takes to hash
    //% Asynchronous task this, returns a promise
    //? Btw, we are chaining then() here because, if the user exists & page redirects,
    //? the code will continue to the bcrypt but the password will be undefined.
    // So we avoid that by chaining the promises
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
