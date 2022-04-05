const postDb = require("../models/postModel");
const draftDb = require("../models/draftModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;
const sanitizeHtml = require("sanitize-html");
const jwt = require("jsonwebtoken");
ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

exports.getDraftsByUser = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      try {
        const getDrafts = async () => {
          const drafts = await draftDb
            .find({ user: user.id })
            .sort({ timestamp: -1 });
          res.json({ drafts });
        };
        getDrafts();
      } catch (error) {
        res.json(error);
      }
    }
  })(req, res);
};

exports.createDraft = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const addToDB = async () => {
        try {
          const post = await draftDb({
            user: user._id,
            title: req.body.title,
            body: req.body.postBody ? req.body.postBody : " ",
            imageUrl: req.body.imageUrl,
          });
          await draftDb.create(post);
          return res.status(200).send({ status: "post added" });
        } catch (error) {
          return res.json(error);
        }
      };
      addToDB();
    }
  })(req, res);
};

exports.editDraft = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const updatePost = async () => {
        try {
          const post = await draftDb.findById(req.params.id).populate("user");
          const author = post.user.id;
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

exports.updateDraft = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const updatePost = async () => {
        try {
          const article = await draftDb
            .findById(req.params.id)
            .populate("user");
          const author = article.user.id;
          if (author == user.id) {
            await draftDb.findByIdAndUpdate(ObjectId(req.params.id), {
              $set: {
                title: req.body.title,
                body: req.body.postBody,
                imageUrl: req.body.imageUrl,
                timestamp: Date.now(),
              },
            });
            res.json({ draft: "updated" });
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

exports.deleteDraft = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const deleteDraft = async () => {
        try {
          const article = await draftDb
            .findById(req.params.id)
            .populate("user");
          const author = article.user.id;
          if (author == user.id) {
            await draftDb.findByIdAndDelete(req.params.id);
            res.json({ status: "deleted" });
          } else {
            throw new Error("Not Authorized");
          }
        } catch (error) {
          res.status(401).send(error);
        }
      };
      deleteDraft();
    }
  })(req, res);
};

exports.getSingleDraft = async (req, res, next) => {
  try {
    const post = await draftDb
      .findById(ObjectId(req.params.id))
      .populate("user");
    res.json({ post });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
