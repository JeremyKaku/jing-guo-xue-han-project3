const cookieHelper = require("./cookie.helper.cjs");

const express = require("express");
const router = express.Router();
const PasswordsModel = require("./db/passwords.model.cjs");

// let pokemonColors = [
//     {name: "pikachu", color: "yellow"},
//     {name: "charizard", color: "red"},
// ];

// /api/pokemon/
router.post("/", async function (req, res) {
  const requestBody = req.body;
  const username = cookieHelper.cookieDecryptor(req);

  if (!username) {
    res.status(401);
    return res.send("You need to be logged in to create a password!");
  }

  if (!requestBody.site || !requestBody.password) {
    res.status(401);
    return res.send("Please insert valid site and password!");
  }

  const newPassword = {
    site: requestBody.site,
    password: requestBody.password,
    user: username,
  };

  try {
    const getPasswordResponse = await PasswordsModel.getPasswordsBySite(
      username,
      requestBody.site
    );
    if (!getPasswordResponse) {
      res.status(401);
      return res.send("You already have a password for this site!");
    }

    const response = await PasswordsModel.insertPassword(newPassword);
    // res.cookie("pokemonOwner", "yuchen");
    // res.cookie("favoriteColor", "yellow");
    return res.send(response);
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.send(error);
  }
});

// localhost:8000/api/pokemon?name=pikachu
router.get("/", async function (req, res) {
  const user = cookieHelper.cookieDecryptor(req);

  if (!user) {
    res.status(401);
    return res.send("You need to be logged in to find your passwords!");
  }

  try {
    const allPasswordsResponse = await PasswordsModel.getPasswordsByUser(user);
    return res.send(allPasswordsResponse);
  } catch (error) {
    res.status(400);
    return res.send(" Error retrieving passwords!");
  }
});

// /api/pokemon/pikachu
// --> pkId => pikachu
router.put("/:pkId", async function (req, res) {
  const username = cookieHelper.cookieDecryptor(req);
  const passwordId = req.params.pkId;
  const passwordData = req.body;

  if (!username) {
    res.status(401);
    return res.send("You need to be logged in to update a password!");
  }

  if (!passwordData.site || !passwordData.password) {
    res.status(401);
    return res.send(
      "You need to include the site and password in your request"
    );
  }

  try {
    const getPasswordResponse = await PasswordsModel.getPasswordsBySite(
      username,
      passwordData.site
    );
    if (!getPasswordResponse && getPasswordResponse._id !== passwordId) {
      res.status(401);
      return res.send("You already have a password for this site!");
    }

    const passwordUpdateResponse = await PasswordsModel.updatePassword(
      passwordId,
      passwordData
    );
    return res.send("Successfully updated password for  " + passwordData.site);
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.send(error);
  }
});

// -> /pokemon/pikachu => req.params.pokemonName === pikachu
// -> /pokemon/pikachu?food=banana
router.get("/:pkId", async function (req, res) {
  const pokemonId = req.params.pkId;

  try {
    const getPokemonResponse = await PasswordsModel.getPokemonById(pokemonId);
    return res.send(getPokemonResponse);
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.send(error);
  }

  // res.status(404);
  // return res.send("Pokemon with name " + pokemonName + " not found :(");
});

router.delete("/:pkId", async function (req, res) {
  const passwordId = req.params.pkId;
  const username = cookieHelper.cookieDecryptor(req);

  if (!username) {
    res.status(401);
    return res.send("You need to be logged in to delete the password!");
  }

  try {
    const getPasswordResponse = await PasswordsModel.getPasswordsById(
      passwordId
    );
    if (!getPasswordResponse) {
      res.status(400);
      return res.send("You do not have this password!");
    }

    const deletePasswordResponse = await PasswordsModel.deletePassword(
      passwordId
    );
    return res.send(deletePasswordResponse);
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.send(error);
  }
});

module.exports = router;
