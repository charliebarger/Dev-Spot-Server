const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validationController = require("../controllers/validation");
const commentController = require("../controllers/commentController");

//POSTS

//POST new post
router.post(
  "/",
  postController.checkFormValidity,
  postController.validatePost(),
  validationController.checkFormForErrors,
  postController.creatIt
);

//GET all post
router.get("/", postController.getAllPosts);

//GET single post
router.get("/:id", postController.getSinglePost);

//PUT edit post
router.put("/update/:id", postController.updatePost);

//DELETE post
router.delete("/delete/:id", postController.deletePost);

//COMMENTS

//POST a comment
router.post(
  "/:postId/comments",
  commentController.validateComment(),
  validationController.checkFormForErrors,
  commentController.createComment
);

//PUT edit a comment (currently not allowed)
// router.put("/:postId/comments/:commentId");

//DELETE a comment
router.delete("/comments/delete/:commentId", commentController.deleteComment);
