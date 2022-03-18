const commentDb = require("../models/commentModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;
const passport = require("passport");
//add message to db

exports.createComment = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      console.log("reach below");
      const addToDB = async () => {
        try {
          const post = await commentDb({
            user: user._id,
            comment: req.body.comment,
            post: ObjectId(req.params.postId),
          });
          await commentDb.create(post);
          return res.status(200).send({ status: "post added" });
        } catch (error) {
          return res.status(401).json(error);
        }
      };
      addToDB();
    }
  })(req, res);
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
