const commentDb = require("../models/commentModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;

//add message to db
exports.createComment = async (req, res, next) => {
  try {
    const userId = ObjectId(req.body.user);
    const postId = ObjectId(req.params.postId);
    const user = await commentDb({
      user: userId,
      post: postId,
      comment: req.body.comment,
    });
    await commentDb.create(user);
    res.json({ status: "post added" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//validate messages
exports.validateComment = () => {
  return check("comment", "title is required").notEmpty().isString().trim();
};

//get all posts
exports.getComments = async (req, res, next) => {
  console.log(req.params.postId);
  try {
    const post = await commentDb
      .find({ post: ObjectId(req.params.postId) })
      .sort({ timestamp: -1 });
    //   .populate("user")
    //   .populate("post");
    res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//allow deelting message is the user is an admin
exports.deleteComment = async (req, res, next) => {
  console.log(req.params.commentId);
  try {
    await commentDb.findByIdAndDelete(req.params.commentId);
    res.json({ post: "deleted" });
  } catch (error) {
    next(error);
  }
};

//update post
exports.updatePost = async (req, res, next) => {
  try {
    const updatedComment = await commentDb.findByIdAndUpdate(
      ObjectId(req.params.id),
      {
        $set: {
          comment: req.body.comment,
        },
      }
    );
    res.json({ updatedComment });
  } catch (error) {
    next(error);
  }
};
