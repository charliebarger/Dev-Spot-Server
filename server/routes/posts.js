const express = require("express");
const router = express.Router();
const commentController = require("../controllers/postController");
const validationController = require("../controllers/validation");
//GET all posts
router.get("/");

//POST new post
router.post(
  "/",
  commentController.validatePost(),
  validationController.checkValidation,
  commentController.createPost
);

//GET single post
router.get("/:id");

//PUT edit post
router.put("/:id/edit");

//DELETE post
router.delete("/:id/delete");

//GET all comments on post
router.get("/:id/comments");

//POST a comment
router.post("/:id/comments");

//PUT edit a comment
router.put("/:postId/comments/:commentId");

//PUT edit a comment
router.delete("/:postId/comments/:commentId");

module.exports = router;
