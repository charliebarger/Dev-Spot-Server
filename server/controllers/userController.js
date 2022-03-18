const userDB = require("../models/usersModel");
const { check } = require("express-validator");

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
