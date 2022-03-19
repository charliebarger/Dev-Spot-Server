const mongoose = require("mongoose");
const { DateTime } = require("luxon");

var schemaOptions = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

const draftSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "this field is required",
    },
    body: {
      type: String,
      required: "this field is required",
    },
    imageUrl: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: "this field is required",
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: "this field is required",
    },
  },
  schemaOptions
);

draftSchema.virtual("shortDate").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATE_SHORT
  );
});

module.exports = mongoose.model("draft", draftSchema);
