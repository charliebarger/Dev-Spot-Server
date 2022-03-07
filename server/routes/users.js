const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validationController = require("../controllers/validation");
const signInController = require("../controllers/signIn");
//POST log in
router.post(
  "/signup",
  userController.checkSignUpFormValidity,
  userController.signUpvalidate(),
  validationController.checkValidation,
  userController.createUser
);

const jwt = require("jsonwebtoken");
const passport = require("passport");
const { user } = require("../pop");

/* POST login. */
router.post("/login", function (req, res) {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user.toJSON(), "secret");
      return res.json({ user, token });
    });
  })(req, res);
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
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
