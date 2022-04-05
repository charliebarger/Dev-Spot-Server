const postDb = require("../models/postModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;
const sanitizeHtml = require("sanitize-html");
const jwt = require("jsonwebtoken");
ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
/* POST login. */

exports.createPost = (req, res) => {
  console.log("post here blahhh");
  console.log(req.url);
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const addToDB = async () => {
        try {
          const post = await postDb({
            user: user._id,
            title: req.body.title,
            body: req.body.postBody,
            imageUrl: req.body.imageUrl,
          });
          await postDb.create(post);
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
    req.body.postBody = req.body.postBody
      ? sanitizeHtml(req.body.postBody, {
          allowedAttributes: {
            "*": ["style"],
          },
        })
      : "";
    next();
  } catch (error) {
    console.log("sanitize error");
    next(error);
  }
};

exports.sanitizePostBody = sanitizePostBody;

const checkImg = async (req, res, next) => {
  const image =
    req.body.imageUrl.match(/(jpeg|jpg|gif|png)/) != null ||
    req.body.imageUrl === "";
  if (image) {
    next();
  } else {
    res.status(400).json({ error: "Not A Valid Image" });
  }
};

exports.checkFormValidity = [sanitizePostBody, checkImg];

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
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const updatePost = async () => {
        try {
          const article = await postDb.findById(req.params.id).populate("user");
          const author = article.user.id;
          if (author == user.id) {
            console.log("ok were gunna call it!");
            await postDb.findByIdAndUpdate(ObjectId(req.params.id), {
              $set: {
                title: req.body.title,
                body: req.body.postBody,
                imageUrl: req.body.imageUrl,
                timestamp: Date.now(),
              },
            });
            res.json({ post: "updated" });
          } else {
            throw new Error("Not Authorized");
          }
        } catch (error) {
          res.json({ error });
        }
      };
      updatePost();
    }
  })(req, res);
};

exports.deletePost = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const deletePost = async () => {
        try {
          const article = await postDb.findById(req.params.id).populate("user");
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
      deletePost();
    }
  })(req, res);
};

exports.getPostsByUser = (req, res) => {
  console.log("reached post by user");
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      try {
        const getPosts = async () => {
          const posts = await postDb.find({ user: user.id });
          res.json({ posts });
        };
        getPosts();
      } catch (error) {
        res.json(error);
      }
    }
  })(req, res);
};

exports.editPost = async (req, res, next) => {
  console.log("hi");
  passport.authenticate("jwt", { session: false }, (err, user) => {
    console.log(err, user);
    if (err || !user) {
      console.log("error alert");
      return res.json({
        error: err[0].msg,
      });
    } else {
      console.log("updating pist");
      const updatePost = async () => {
        try {
          console.log("in da func");
          const post = await postDb.findById(req.params.id).populate("user");
          const author = post.user.id;
          console.log(author, user.id);
          if (author == user.id) {
            res.json({ post });
          } else {
            throw new Error("Not Authorized");
          }
        } catch (error) {
          res.json({ error });
        }
      };
      updatePost();
    }
  })(req, res);
};
