const Schema = require("mongoose").Schema;

module.exports = new Schema(
  {
    sharingUser: {
      type: String,
      required: true,
    },
    sharedSite: {
      type: String,
      required: true,
    },
    sharedPassword: {
      type: String,
      required: true,
    },
    recipientUser: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "shareInfo" }
);
