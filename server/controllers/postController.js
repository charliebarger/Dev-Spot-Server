const postDb = require("../models/postModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;

//add message to db
exports.createPost = async (req, res, next) => {
  try {
    req.userId = ObjectId(req.userId);
    const user = await postDb({
      user: req.userId,
      title: req.body.postTitle,
      body: req.body.postBody,
    });
    await postDb.create(user);
    res.json({ status: "post added" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//validate messages
exports.validatePost = () => {
  return [
    check("postTitle", "title is required")
      .notEmpty()
      .isString()
      .isLength({ max: 25 })
      .trim(),
    check("postBody", "body is required")
      .notEmpty()
      .isString()
      .isLength({ max: 140 })
      .trim(),
  ];
};

//allow deelting message is the user is an admin
exports.deleteMessage = async (req, res, next) => {
  try {
    await postDb.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};
