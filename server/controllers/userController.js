const userDB = require("../models/usersModel");
const { check } = require("express-validator");
const draftDb = require("../models/draftModel");
const postDb = require("../models/postModel");
const jwt = require("jsonwebtoken");
ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

//Sign Up

//make sure email is available
exports.checkEmailAvailability = async (req, res, next) => {
  try {
    const emailUnavailable = await userDB.exists({
      email: req.body.email,
    });
    emailUnavailable ? res.json({ error: "Email is Unavailable" }) : next();
  } catch (error) {
    next(error);
  }
};

//create a new user
exports.createUser = async (req, res, next) => {
  try {
    const user = await userDB({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    await userDB.create(user);
    res.json({ status: "user created" });
  } catch (error) {
    next(error);
  }
};

//Express Validator (Form Vaidation)

//sign up validation
exports.signUpvalidate = (req, res) => {
  return [
    check("firstName", "name is required")
      .notEmpty()
      .isString()
      .trim()
      .toLowerCase(),
    check("lastName", "name is required")
      .notEmpty()
      .isString()
      .trim()
      .toLowerCase(),
    check("email", "email is required")
      .notEmpty()
      .isString()
      .isEmail()
      .trim()
      .toLowerCase(),
    check("password", "Password Must be Between 5 and 50 characters")
      .notEmpty()
      .isLength({ min: 5, max: 20 }),
    check("password", "Password Confirmation is Invalid").custom(
      (value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return false;
        }
        return true;
      }
    ),
  ];
};

//Log In

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

exports.getDashboard = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const getPosts = async () => {
        const drafts = await getDraftsbyUser(user);
        const posts = await getPostsbyUser(user);
        res.json({ user, drafts, posts });
      };
      getPosts();
    }
  })(req, res);
};

//---------------------------------------------//

const getDraftsbyUser = async (user) => {
  try {
    const drafts = await draftDb.find({ user: user.id });
    return drafts;
  } catch (error) {
    return false;
  }
};

const getPostsbyUser = async (user) => {
  try {
    const posts = await postDb.find({ user: user.id });
    return posts;
  } catch (error) {
    return false;
  }
};

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

exports.getPostsByUser = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      try {
        const getPosts = async () => {
          const posts = await postDb.find({ user: user.id });
          res.json({ posts });
        };
        getPosts();
      } catch (error) {
        res.json(error);
      }
    }
  })(req, res);
};

exports.getUserInfo = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      res.json({ user });
    }
  })(req, res);
};
