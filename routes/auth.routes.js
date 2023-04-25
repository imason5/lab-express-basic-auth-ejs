const { Router } = require("express");
const UserModel = require("../models/User.model");
const router = new Router();
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get("/signup", (req, res, next) => {
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

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// POST route ==> to process form data

router.post("/login", async (req, res, next) => {});

module.exports = router;
