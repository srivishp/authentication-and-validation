const User = require("../models/user");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your@email.com",
    pass: "your password",
  },
});
//% Package to encrypt data
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    //* Accessing the key of the flash message
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //* Finding a user by their email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //> Displaying the flash message
        req.flash("error", "Invalid Email or Password");
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
          req.flash("error", "Invalid email or password.");
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

// SIGN UP SECTION
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      req.flash("error", "E-Mail exists already, please pick a different one.");
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
        return transporter.sendMail({
          to: email,
          from: "your@email.com",
          subject: "Sign up successful!",
          html: "<h1>Welcome to the testing marketplace</h1>",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};
