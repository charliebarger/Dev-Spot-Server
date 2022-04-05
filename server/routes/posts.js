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
  validationController.checkFormForErrors,
  postController.createPost
);

//PUT edit post
router.put("/update/:id", postController.updatePost);

//GET all post
router.get("/myPosts", postController.getPostsByUser);

////PUT edit post
router.get("/edit/:id", postController.editPost);

//GET single post
router.get("/:id", postController.getSinglePost);

//GET all post
router.get("/", postController.getAllPosts);

//DELETE post
router.delete("/delete/:id", postController.deletePost);

//comment routes

//GET all comments on post
router.get("/:postId/comments", commentController.getComments);

//POST a comment
router.post(
  "/:postId/comments",
  commentController.validateComment(),
  validationController.checkFormForErrors,
  commentController.createComment
);

//PUT delete a comment
router.delete("/comments/:commentId/delete", commentController.deleteComment);

module.exports = router;
