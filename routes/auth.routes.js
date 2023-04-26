const { Router } = require("express");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

const UserModel = require("../models/User.model");
const router = new Router();
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET route to display the signup form to users, using the isLoggedOut middleware to ensure the user is not already logged in
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup", { errorMessage: null });
});

// POST route to process signup form data and create a new user
router.post("/signup", async (req, res, next) => {
  try {
    // Check if the username already exists in the database
    const potentialUser = await UserModel.findOne({
      username: req.body.username,
    });

    if (!potentialUser) {
      // Validate password using the regex pattern
      if (pwdRegex.test(req.body.password)) {
        // Generate salt and hash the password
        const salt = bcryptjs.genSaltSync(saltRounds);
        const passwordHash = bcryptjs.hashSync(req.body.password, salt);

        // Create a new user with the hashed password
        const newUser = await UserModel.create({
          username: req.body.username,
          passwordHash,
        });
        console.log(newUser);

        // Redirect to login page after a successful signup
        res.redirect("/login");
      } else {
        // Render signup form with an error message if the password is invalid
        res.render("auth/signup", { errorMessage: "Invalid password" });
      }
    } else {
      // Render signup form with an error message if the username already exists
      res.render("auth/signup", { errorMessage: "Username already exists" });
    }
  } catch (err) {
    console.log(err);
  }
});

// GET route to display the login form to users
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login", { errorMessage: null });
});

// POST route to process login form data and authenticate the user
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter both username and password.",
    });
    return;
  }

  try {
    // Check if the user exists in the database
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.render("auth/login", { errorMessage: "Invalid login credentials." });
      return;
    }

    // Compare the provided password with the stored hashed password
    const passwordCorrect = bcryptjs.compareSync(password, user.passwordHash);
    if (passwordCorrect) {
      // Set the currentUser in the session and redirect to the main page
      req.session.currentUser = user;
      res.redirect("/main");
    } else {
      // Render the login form with an error message if the password is incorrect
      res.render("auth/login", { errorMessage: "Invalid login credentials." });
    }
  } catch (error) {
    next(error);
  }
});

// GET route to display  main protected page
router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("protected/main");
});

// GET route to display  private protected page
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("protected/private");
});

// GET route to process logout requests
router.get("/logout", isLoggedIn, (req, res, next) => {
  // Destroy the session
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
