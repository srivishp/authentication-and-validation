exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    // For load of every page we need the user to be logged in
    // So, we check for the login status on all render() calls
    isAuthenticated: req.session.isLoggedIn,
  });
};
