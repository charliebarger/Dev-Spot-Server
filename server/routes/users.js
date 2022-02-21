const express = require("express");
const router = express.Router();

//POST log in
router.post("/login");

//POST log out
router.post("/logout");

//GET single user
router.get("/:id");
