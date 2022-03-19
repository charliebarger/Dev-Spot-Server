const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validationController = require("../controllers/validation");
const commentController = require("../controllers/commentController");

//post routes

//POST new post
router.post(
  "/",
  postController.checkFormValidity,
  postController.validatePost(),
  validationController.checkValidation,
  postController.creatIt
);

//GET single post
router.get("/:id", postController.getSinglePost);

//GET all post
router.get("/", postController.getAllPosts);

//PUT edit post
router.put("/:id/edit", postController.updatePost);

//DELETE post
router.delete("/:id/delete", postController.deletePost);

// POST save draft
router.post(
  "/draft",
  (req, res, next) => {
    console.log("proper route");
    next();
  },
  postController.sanitizePostBody,
  postController.validateDraft(),
  validationController.checkValidation,
  postController.creatIt
);

//comment routes

//GET all comments on post
router.get("/:postId/comments", commentController.getComments);

//POST a comment
router.post(
  "/:postId/comments",
  commentController.validateComment(),
  validationController.checkValidation,
  commentController.createComment
);

//PUT edit a comment (currently not allowed)
// router.put("/:postId/comments/:commentId");

//PUT delete a comment
router.delete("/comments/:commentId/delete", commentController.deleteComment);

module.exports = router;
