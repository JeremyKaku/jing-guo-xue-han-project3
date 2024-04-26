const cookieHelper = require("./cookie.helper.cjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userModel = require("./db/user.model.cjs");
const bcrypt = require("bcryptjs");

router.post("/register", async function (request, response) {
  request.body.password = bcrypt.hashSync(request.body.password, 10);
  const requestBody = request.body;

  const username = requestBody.username;
  const password = requestBody.password;

  const newUser = {
    username: username,
    password: password,
  };

  try {
    const getUserResponse = await userModel.getUserByUsername(username);
    if (getUserResponse) {
      response.status(400);
      return response.send("User already exists.");
    }

    const createUserResponse = await userModel.insertUser(newUser);

    const cookieData = { username: username };

    const token = jwt.sign(cookieData, "SYSTEM_SECRET", {
      expiresIn: "14d",
    });

    response.cookie("token", token, { httpOnly: true });

    return response.send("User with username " + username + " created.");
  } catch (error) {
    response.status(400);
    return response.send("Failed to create user with message " + error);
  }
});

router.post("/login", async function (request, response) {
  const username = request.body.username;
  const password = request.body.password;

  try {
    const getUserResponse = await userModel.getUserByUsername(username);
    if (!getUserResponse) {
      response.status(400);
      return response.send("No user found.");
    }

    // if (password !== getUserResponse.password) {
    //   response.status(400);
    //   return response.send("Account or password incorrect.");
    // }

    if (!bcrypt.compareSync(password, getUserResponse.password)) {
      response.status(401).send("Account or password incorrect.");
    }

    const cookieData = { username: username };

    const token = jwt.sign(cookieData, "SYSTEM_SECRET", {
      expiresIn: "14d",
    });

    response.cookie("token", token, { httpOnly: true });

    return response.send("Logged in!");
  } catch (error) {
    response.status(400);
    return response.send("Failed to login: " + error);
  }
});

router.get("/loggedIn", function (request, response) {
  const username = cookieHelper.cookieDecryptor(request);

  if (username) {
    return response.send({
      username: username,
    });
  } else {
    response.status(400);
    return response.send("Not logged in!");
  }
});

router.post("/logout", function (request, response) {
  response.clearCookie("username");
  return response.send("Logged out");
});

module.exports = router;
