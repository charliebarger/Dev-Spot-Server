const userDB = require("../models/usersModel");
const { check } = require("express-validator");

const checkUsernameAvailability = async (req, res, next) => {
  console.log(req.body);
  try {
    const usernameUnavailable = await userDB.exists({
      username: req.body.username,
    });
    console.log(usernameUnavailable);
    if (usernameUnavailable) {
      //   req.flash("msg", "Username is Not Available");
      //   req.flash("url", req.body.imageUrl);
      //   res.redirect("/sign-up");
      res.json({ status: "error" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkPasswordLength = async (req, res, next) => {
  if (req.body.password.length < 5) {
    // req.flash("msg", "Password must be more than 5 characters");
    // req.flash("username", req.body.username);
    // req.flash("url", req.body.imageUrl);
    res.json({ status: "error" });
  } else {
    next();
  }
};

const checkUsernameLength = async (req, res, next) => {
  if (req.body.username.length > 20 || req.body.username.length < 5) {
    // req.flash("msg", "Username must be between 5 and 20 characters");
    // req.flash("url", req.body.imageUrl);
    res.json({ status: "error" });
  } else {
    next();
  }
};

const checkConfirmPassword = async (req, res, next) => {
  if (req.body.password != req.body.confirmPassword) {
    // req.flash("username", req.body.username);
    // req.flash("msg", "Passwords do not match");
    // req.flash("url", req.body.imageUrl);
    res.json({ status: "error" });
  } else {
    next();
  }
};

exports.checkSignUpFormValidity = [
  checkUsernameAvailability,
  checkPasswordLength,
  checkConfirmPassword,
  checkUsernameLength,
];

//create a new user
exports.createUser = async (req, res, next) => {
  try {
    const user = await userDB({
      username: req.body.username,
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
    check("username", "username is required")
      .notEmpty()
      .isString()
      .isLength({ min: 5, max: 20 })
      .trim()
      .toLowerCase(),
    check("password", "password is required")
      .notEmpty()
      .isLength({ min: 5, max: 20 })
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};
