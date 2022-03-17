const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: "this field is required",
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: "this field is required",
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "post",
    required: "this field is required",
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: "this field is required",
  },
});

commentSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp)
    .toLocaleString(DateTime.DATETIME_SHORT)
    .replace(",", " at");
});

module.exports = mongoose.model("comment", commentSchema);
