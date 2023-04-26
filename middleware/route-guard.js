const isLoggedIn = (req, res, next) => {
  // This function checks if the user is logged in.
  // If the user is not logged in, it redirects the user to the login page.

  // Check if the user is logged in.
  if (!req.session.currentUser) {
    // Redirect the user to the login page.
    return res.redirect("/auth/login");
  }

  // The user is logged in, so call the next middleware function.
  next();
};

const isLoggedOut = (req, res, next) => {
  // This function checks if the user is logged out.
  // If the user is logged out, it redirects the user to the homepage.

  // Check if the user is logged in.
  if (req.session.currentUser) {
    // Redirect the user to the homepage.
    return res.redirect("/");
  }

  // The user is logged out, so call the next middleware function.
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
