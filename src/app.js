const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "kennedy",
    lastName: "Chukwu",
    emailId: "kennedy@gmai.com",
    password: "kennedy@123",
  });

  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server successfully listening on port 3000");
    });
    console.log("App.listen() has been called...");
  })
  .catch((err) => {
    console.error("Database cannot be connected!! ");
  });
