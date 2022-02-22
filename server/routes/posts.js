const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validationController = require("../controllers/validation");

//POST new post
router.post(
  "/",
  postController.validatePost(),
  validationController.checkValidation,
  postController.createPost
);

//GET single post
router.get("/:id", postController.getSinglePost);

//GET all post
router.get("/", postController.getAllPosts);

//PUT edit post
router.put("/:id/edit", postController.updatePost);

//DELETE post
router.delete("/:id/delete", postController.deletePost);

//GET all comments on post
router.get("/:id/comments");

//POST a comment
router.post("/:id/comments");

//PUT edit a comment
router.put("/:postId/comments/:commentId");

//PUT edit a comment
router.delete("/:postId/comments/:commentId");

module.exports = router;
