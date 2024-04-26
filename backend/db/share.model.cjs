const model = require("mongoose").model;

const ShareSchema = require("./share.schema.cjs");

const ShareModel = model("Share", ShareSchema);

function insertShareInfo(shareInfo) {
  return ShareModel.create(shareInfo);
}

function getAllShareInfo() {
  return ShareModel.find().exec();
}

function updateShareStatus(id, shareInfo) {
  return ShareModel.findOneAndUpdate({ _id: id }, shareInfo);
}

function getShareInfoByName(
  sharingUser,
  recipientUser,
  sharedSite,
  sharedPassword
) {
  return ShareModel.find({
    sharingUser: sharingUser,
    recipientUser: recipientUser,
    sharedPassword: sharedPassword,
    sharedSite: sharedSite,
  }).exec();
}
function getShareInfoBySharingUser(sharingUser) {
  return ShareModel.find({
    sharingUser: sharingUser,
  }).exec();
}
function getShareInfoByRecipientUser(recipientUser) {
  return ShareModel.find({
    recipientUser: recipientUser,
  }).exec();
}

module.exports = {
  insertShareInfo,
  getAllShareInfo,
  updateShareStatus,
  getShareInfoByName,
  getShareInfoBySharingUser,
  getShareInfoByRecipientUser,
};
