const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
/* POST login. */

exports.logIn = (req, res) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Incorrect Username or Password",
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = "Bearer " + jwt.sign(user.toJSON(), "secret");
      return res.json({ user, token });
    });
  })(req, res);
};
