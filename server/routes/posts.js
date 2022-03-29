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

//PUT edit draft
router.put("/draft/update/:id", postController.updatePost);

//GET all post
router.get("/myPosts", postController.getPostsByUser);

//GET single post
router.get("/:id", postController.getSinglePost);

//Get single draft
router.get("/draft/:id", postController.getSingleDraft);

//GET all post
router.get("/", postController.getAllPosts);

//PUT edit post
router.put("/:id/edit", postController.updatePost);

//DELETE post
router.delete("/delete/:id", postController.deletePost);

router.delete("/draft/delete/:id", postController.deletePost);

// POST save draft
router.post(
  "/draft",
  (req, res, next) => {
    console.log("proper route");
    next();
  },
  postController.sanitizePostBody,
  postController.validateDraft(),
  validationController.checkFormForErrors,
  postController.createPost
);

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

//PUT edit a comment (currently not allowed)
// router.put("/:postId/comments/:commentId");

//PUT delete a comment
router.delete("/comments/:commentId/delete", commentController.deleteComment);

module.exports = router;
