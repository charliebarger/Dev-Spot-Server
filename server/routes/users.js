const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validationController = require("../controllers/validation");

//POST log in
router.post(
  "/signup",
  userController.checkSignUpFormValidity,
  userController.signUpvalidate(),
  validationController.checkValidation,
  userController.createUser
);

router.post("/login", (req, res) => {
  res.json({ recieved: "yes" });
});

//POST log out
router.post("/logout");

//GET single user
router.get("/:id");

module.exports = router;
