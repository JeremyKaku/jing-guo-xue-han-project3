const express = require("express");
const passwords = require("./backend/passwords.api.cjs");
const users = require("./backend/user.api.cjs");
const share = require("./backend/share.api.cjs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const process = require("process");

const app = express();

// const mongoDBEndpoint =
//   "mongodb+srv://jing:986689@webdev.rporsug.mongodb.net/?retryWrites=true&w=majority&appName=WebDev";

const mongoDBEndpoint = process.env.MONGODB_URI || "mongodb://127.0.0.1/WebDev";

mongoose.connect(mongoDBEndpoint, {});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB:"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/passwords", passwords);
app.use("/api/users", users);
app.use("/api/share", share);

let frontend_dir = path.join(__dirname, "dist");
app.use(express.static(frontend_dir));
app.get("*", function (req, res) {
  console.log("received request");
  res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(process.env.PORT || 8000, function () {
  console.log("Starting app now...");
});
