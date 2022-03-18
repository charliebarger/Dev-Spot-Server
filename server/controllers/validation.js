const { validationResult } = require("express-validator");

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
};
