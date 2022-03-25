const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");
const validationController = require("../controllers/validation");
const signInController = require("../controllers/signIn");

//POST Sign Up
router.post(
  "/signup",
  userController.checkEmailAvailability,
  userController.signUpvalidate(),
  validationController.checkFormForErrors,
  userController.createUser
);

router.get("/", userController.getUserInfo);

// POST Login
router.post("/login", signInController.logIn);

// POST Logout
router.post("/logout", function (req, res) {
  req.logout();
  res.send({ loggedOut: true });
});

//GET Protected Route
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.email,
      },
    });
  }
);

//GET dashboard
router.get("/dashboard", userController.getDashboard);

module.exports = router;
