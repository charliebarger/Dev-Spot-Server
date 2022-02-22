const postDb = require("../models/postModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;

//add message to db
exports.createPost = async (req, res, next) => {
  try {
    const userId = ObjectId(req.body.userId);
    const user = await postDb({
      user: userId,
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

//get single post
exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await postDb.findById(ObjectId(req.params.id));
    res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const post = await postDb.find({}).sort({ timestamp: -1 }).populate("user");
    res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//allow deelting message is the user is an admin
exports.deletePost = async (req, res, next) => {
  try {
    await postDb.findByIdAndDelete(req.params.id);
    res.json({ post: "deleted" });
  } catch (error) {
    next(error);
  }
};

//update post
exports.updatePost = async (req, res, next) => {
  try {
    const updatedPost = await postDb.findByIdAndUpdate(
      ObjectId(req.params.id),
      {
        $set: {
          title: req.body.postTitle,
          body: req.body.postBody,
        },
      }
    );
    res.json({ updatedPost });
  } catch (error) {
    next(error);
  }
};
