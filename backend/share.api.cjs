const cookieHelper = require("./cookie.helper.cjs");

const express = require("express");
const router = express.Router();
const ShareModel = require("./db/share.model.cjs");
const userModel = require("./db/user.model.cjs");

router.post("/", async function (req, res) {
  const requestBody = req.body;
  const username = cookieHelper.cookieDecryptor(req);

  if (!username) {
    res.status(401);
    return res.send("You need to be logged in to share your password!");
  }

  if (
    !requestBody.sharedPassword ||
    !requestBody.recipientUser ||
    !requestBody.sharedSite
  ) {
    res.status(401);
    return res.send("Please share the valid password information!");
  }

  try {
    const getUserResponse = await userModel.getUserByUsername(
      requestBody.recipientUser
    );
    if (!getUserResponse) {
      res.status(400);
      return res.send("Recipient does not exist!");
    }

    const getShareInfoResponse = await ShareModel.getShareInfoByName(
      username,
      requestBody.recipientUser,
      requestBody.sharedSite,
      requestBody.sharedPassword
    );
    if (getShareInfoResponse && getShareInfoResponse.length > 0) {
      res.status(401);
      return res.send("You already shared!");
    }
    const sharePasswordInfo = {
      sharingUser: username,
      sharedSite: requestBody.sharedSite,
      sharedPassword: requestBody.sharedPassword,
      recipientUser: requestBody.recipientUser,
      status: "Pending",
    };
    const response = await ShareModel.insertShareInfo(sharePasswordInfo);
    return res.send(response);
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.send(error);
  }
});

router.get("/", async function (req, res) {
  const user = cookieHelper.cookieDecryptor(req);

  if (!user) {
    res.status(401);
    return res.send("You need to be logged in to find the shared passwords!");
  }

  try {
    const allRecivedResponse = await ShareModel.getShareInfoByRecipientUser(
      user
    );
    return res.send(allRecivedResponse);
  } catch (error) {
    res.status(400);
    return res.send(" Error retrieving the shared passwords from other!");
  }
});

router.get("/shared", async function (req, res) {
  const user = cookieHelper.cookieDecryptor(req);

  if (!user) {
    res.status(401);
    return res.send("You need to be logged in to find the shared passwords!");
  }

  try {
    const allPasswordsResponse = await ShareModel.getShareInfoBySharingUser(
      user
    );
    return res.send(allPasswordsResponse);
  } catch (error) {
    res.status(400);
    return res.send(" Error retrieving the shared passwords from you!");
  }
});

// /api/pokemon/pikachu
// --> pkId => pikachu
router.put("/:pkId", async function (req, res) {
  const username = cookieHelper.cookieDecryptor(req);
  const shareId = req.params.pkId;
  const shareData = req.body;

  if (!username) {
    res.status(401);
    return res.send("You need to be logged in to update a shared password!");
  }

  if (!shareData.status) {
    res.status(401);
    return res.send("You need to include all the information in your request");
  }

  try {
    const shareUpdateResponse = await ShareModel.updateShareStatus(
      shareId,
      shareData
    );
    return res.send("Successfully updated the shared password status!");
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.send(error);
  }
});

module.exports = router;
