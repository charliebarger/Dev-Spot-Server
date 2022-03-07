const userDB = require("../models/usersModel");
const { check } = require("express-validator");

const checkEmailAvailability = async (req, res, next) => {
  console.log("here1");
  try {
    const emailUnavailable = await userDB.exists({
      email: req.body.email,
    });
    if (emailUnavailable) {
      //   req.flash("msg", "Username is Not Available");
      //   req.flash("url", req.body.imageUrl);
      res.json({ "": "error" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkPasswordLength = async (req, res, next) => {
  console.log("here2");
  if (req.body.password.length < 5) {
    // req.flash("msg", "Password must be more than 5 characters");
    // req.flash("username", req.body.username);
    // req.flash("url", req.body.imageUrl);
    res.json({ status: "error" });
  } else {
    next();
  }
};

const checkConfirmPassword = async (req, res, next) => {
  console.log("here3");
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
  checkEmailAvailability,
  checkPasswordLength,
  checkConfirmPassword,
];

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
