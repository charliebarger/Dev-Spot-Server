const postDb = require("../models/postModel");
const draftDb = require("../models/draftModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;
const sanitizeHtml = require("sanitize-html");
const jwt = require("jsonwebtoken");
ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

exports.getDraftsByUser = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      try {
        const getDrafts = async () => {
          const drafts = await draftDb.find({ user: user.id });
          res.json({ drafts });
        };
        getDrafts();
      } catch (error) {
        res.json(error);
      }
    }
  })(req, res);
};
