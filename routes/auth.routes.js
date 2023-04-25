const { Router } = require("express");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

const UserModel = require("../models/User.model");
const router = new Router();
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup", { errorMessage: null });
});

// POST route ==> to process form data
router.post("/signup", async (req, res, next) => {
  try {
    const potentialUser = await UserModel.findOne({
      username: req.body.username,
    });

    if (!potentialUser) {
      if (pwdRegex.test(req.body.password)) {
        const salt = bcryptjs.genSaltSync(saltRounds);

        // This variable holds the encrypted password
        const passwordHash = bcryptjs.hashSync(req.body.password, salt);

        const newUser = await UserModel.create({
          username: req.body.username,
          passwordHash,
        });
        console.log(newUser);

        res.redirect("/login");
      } else {
        res.render("auth/signup", { errorMessage: "Invalid password" });
      }
    } else {
      res.render("auth/signup", { errorMessage: "Username already exists" });
    }
  } catch (err) {
    console.log(err);
  }
});

// GET route ==> to display the login form to users
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login", { errorMessage: null });
});

// POST route ==> to process form data

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter both username and password.",
    });
    return;
  }

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.render("auth/login", { errorMessage: "Invalid login credentials." });
      return;
    }

    const passwordCorrect = bcryptjs.compareSync(password, user.passwordHash);
    if (passwordCorrect) {
      req.session.currentUser = user;
      res.redirect("/main"); // Add this line to redirect the user after a successful login
    } else {
      res.render("auth/login", { errorMessage: "Invalid login credentials." });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("protected/main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("protected/private");
});

module.exports = router;
