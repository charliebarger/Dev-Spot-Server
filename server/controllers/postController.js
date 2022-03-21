const postDb = require("../models/postModel");
const draftDb = require("../models/draftModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;
const sanitizeHtml = require("sanitize-html");
const jwt = require("jsonwebtoken");
ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
/* POST login. */

exports.creatIt = (req, res) => {
  console.log("at creatIT");
  const draft = req.url.includes("draft");
  console.log(draft);
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const pickDb = draft ? draftDb : postDb;
      const addToDB = async () => {
        try {
          const post = await pickDb({
            user: user._id,
            title: req.body.title,
            body: req.body.postBody,
            imageUrl: req.body.imageUrl,
          });
          await pickDb.create(post);
          return res.status(200).send({ status: "post added" });
        } catch (error) {
          return res.json(error);
        }
      };
      addToDB();
    }
  })(req, res);
};

const sanitizePostBody = (req, body, next) => {
  try {
    req.body.postBody = sanitizeHtml(req.body.postBody, {
      allowedAttributes: {
        "*": ["style"],
      },
    });
    next();
  } catch (error) {
    console.log("sanitize error");
    next(error);
  }
};

exports.sanitizePostBody = sanitizePostBody;

const checkUrl = (req, res, next) => {
  if (req.body.imageUrl == "") {
    req.body.imageUrl = "https://i.imgur.com/gT6nqAf.png";
  }
  next();
};

const checkImg = async (req, res, next) => {
  const image = req.body.imageUrl.match(/(jpeg|jpg|gif|png)/) != null;
  if (image) {
    next();
  } else {
    res.status(400).json({ error: "Not A Valid Image" });
  }
};

exports.checkFormValidity = [sanitizePostBody, checkUrl, checkImg];

//validate messages
exports.validatePost = () => {
  return [
    check("title", "title is required").notEmpty().isString().isLength().trim(),
    // check("imageUrl").exists().isString().trim(),
    check("postBody", "Post Body Cannot be Empty").notEmpty().isString().trim(),
  ];
};

exports.validateDraft = () => {
  return [
    check("title", "title must be string").isString().trim(),
    check("imageUrl").isString().trim(),
    check("postBody", "Post Body must be a string").isString().trim(),
  ];
};

//get single post
exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await postDb
      .findById(ObjectId(req.params.id))
      .populate("user");
    res.json({ post });
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

//update post
exports.updatePost = async (req, res, next) => {
  try {
    const updatedPost = await postDb.findByIdAndUpdate(
      ObjectId(req.params.id),
      {
        $set: {
          title: req.body.title,
          body: req.body.postBody,
        },
      }
    );
    res.json({ updatedPost });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const findArticle = await postDb.findById(req.params.id);
    console.log(findArticle.user.id);
    await postDb.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
  } catch (error) {
    res.json(error);
  }
};

exports.delete = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const deletePost = async () => {
        try {
          const article = await postDb.findById(req.params.id);
          const author = article.user.id;
          if (author == user.id) {
            await postDb.findByIdAndDelete(req.params.id);
            res.json({ status: "deleted" });
          } else {
            throw new Error("Not Authorized");
          }
        } catch (error) {
          res.status(401).send(error);
        }
      };
    }
  })(req, res);
};
