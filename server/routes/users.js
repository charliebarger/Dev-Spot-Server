const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validationController = require("../controllers/validation");
const signInController = require("../controllers/signIn");
//POST log in
router.post(
  "/signup",
  userController.checkEmailAvailability,
  userController.signUpvalidate(),
  validationController.checkValidation,
  userController.createUser
);

const jwt = require("jsonwebtoken");
const passport = require("passport");
const { user } = require("../pop");

/* POST login. */
router.post("/login", signInController.logIn);

router.post("/logout", function (req, res) {
  req.logout();
  res.send({ loggedOut: true });
});

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

//POST log out
router.post("/logout");

//GET single user
router.get("/:id");

module.exports = router;
