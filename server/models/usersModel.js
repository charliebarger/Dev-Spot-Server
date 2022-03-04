const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: "this field is required",
  },
  lastName: {
    type: String,
    required: "this field is required",
  },
  email: {
    type: String,
    required: "this field is required",
  },
  password: {
    type: String,
    required: "this field is required",
    maxlength: 20,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("user", userSchema);
