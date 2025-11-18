//% Centralized route protection via middleware
//> This route protection middleware can be added to all the necessary routes in the project & it will be applied to those page redirections
// Easy to manage!
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
