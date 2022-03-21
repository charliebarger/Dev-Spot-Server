const userDB = require("../models/usersModel");
const { check } = require("express-validator");
const draftDb = require("../models/draftModel");
const postDb = require("../models/postModel");
const jwt = require("jsonwebtoken");
ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
exports.checkEmailAvailability = async (req, res, next) => {
  console.log("here1");
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
  console.log(req.body);
  console.log("here");
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

//user validation
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
exports.getDashboard = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    console.log("error here");
    console.log(err, user);
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const getPosts = async () => {
        console.log("no auth error");
        const drafts = await getDraftsbyUser(user);
        const posts = await getPostsbyUser(user);
        res.json({ user, drafts, posts });
      };
      getPosts();
    }
  })(req, res);
};
