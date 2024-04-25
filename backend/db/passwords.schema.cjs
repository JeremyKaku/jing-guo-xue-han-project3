const Schema = require("mongoose").Schema;

module.exports = new Schema(
  {
    site: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "passwordInfo" }
);
