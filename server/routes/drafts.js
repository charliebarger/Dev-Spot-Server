const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validationController = require("../controllers/validation");
const draftController = require("../controllers/draftController");

//GET all drafts
router.get("/myDrafts", draftController.getDraftsByUser);

//GET single draft
router.get("/:id", postController.getSingleDraft);

//POST draft
router.post(
  "/",
  postController.sanitizePostBody,
  postController.validateDraft(),
  validationController.checkFormForErrors,
  draftController.createDraft
);

//PUT edit draft
router.put("/update/:id", draftController.updateDraft);

//DELETE single draft
router.delete("/delete/:id", postController.deletePost);

module.exports = router;
