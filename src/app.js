const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt =  require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const {userAuth} = require("./middlewares/auth")
const {validateSignupData, validateLoginData} = require("./utils/validation");



const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.text({ type: "*/*" }));
app.use((req, res, next) => {
  console.log("Raw body:", req.body);
  next();
});

// POST - signup user
//runValidators - working on post/signup
app.post("/signup", async (req, res) => {

  try {
    validateSignupData(req);

    const {firstName, lastName, emailId, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      firstName, lastName, emailId, password: passwordHash
    });
    await user.save();

    res.status(200).send({
      satus: "success",
      message: "User Added successfully",
      user: user
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: "ERROR : " + err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try{
    validateLoginData(req)

    const {emailId, password} = req.body;

    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){
      //create a jwt
      const token = await jwt.sign({_id : user._id}, "DEV@Tinder$770")
      //cookie
      res.cookie("token", token);
      
      res.status(200).send({
        status: "success",
        message: "Login successful"
      });
    }else{
      throw new Error("Invalid credentials")
    }

  }catch(err){
    res.status(400).send({
      status: "fail",
      message: "ERROR : " + err.message,
    });
  }
})

app.get("/profile",userAuth, async (req, res) => {
  try{
    const user = req.user;
    console.log(user);
    res.send({
      status: "success",
      user: user
    })
  }catch(err){
    res.status(404).send("ERROR: " + err.message)
  }

})

//GET - user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });

    if (user.length === 0) {
      return res.status(404).send({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).send({
      status: "success",
      user: user,
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: "something went wrong",
    });
  }
});

// GET - user by params ID
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).send({
      status: "success",
      user: user,
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: "Something went wrong",
    });
  }
});

//GET - user by userID
// app.get("/user", async (req, res) => {
//   const userId = req.query._id;
//   console.log(userId)

//   if(!userId){
//     return res.status(404)
//     .send({
//       status: "failed",
//       message: "User ID rquired in parameter"
//     })
//   }

//   try{
//     const userFromDB = await User.find(userId);
//     console.log("user from DB", userFromDB);

//     if(!userFromDB){
//       return res.status(404)
//       .send({
//         status: "failed",
//         message: "User not found"
//       })
//     }
//     res.status(200).send({
//       status: "success",
//       user: userFromDB
//     })
//   }catch(err){
//     res.status(404)
//     .send({
//       status: "fail",
//       message: "Error getting user: "
//     })
//   }
// })


// GET - feeds
app.get("/feeds", async (req, res) => {
  try {
    const userFeeds = await User.find({});

    if (userFeeds.length === 0) {
      return res.status(200).send({
        status: "empty",
        message: "No feeds",
      });
    }

    res.status(200).send({
      status: "success",
      "number of feeds": userFeeds.length,
      feeds: userFeeds,
    });
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// PATCH - update user by ID
//runValidators - working on update by ID
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {

    const ALLOWED_UPDATES = ["gender", "photoUrl", "about", "skills"];
    const isUpdatesAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isUpdatesAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills.length > 10){
      throw new Error("Skills cannot be more than 10");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
      new: true,
    });

    res.status(200).send({
      status: "success",
      message: "User updated successfully",
    
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Something went wrong: " + err.message);
  }
});

// PATCH - Update user by emailId
//runValidators - working on update by emailId
app.patch("/user", async (req, res) => {
  const {emailId, ...updateFileds} = req.body;
  console.log(updateFileds);

  try {
    const user = await User.findOne({ emailId: emailId});
    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "User not found",
      });
    }

    const ALLOWED_UPDATES = [ "gender", "photoUrl", "about", "skills"];
    const isUpdatesAllowed = Object.keys(updateFileds).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );

    if (!isUpdatesAllowed) {
      throw new Error("Update not allowed");
    }
    if(updateFileds?.skills.length > 10){
      throw new Error("Skills cannot be more than 10");
    }

    const updatedUser = await User.findOneAndUpdate(
      {emailId},
      updateFileds,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).send({
      status: "success",
      message: "User successfully updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: "Error updating user",
      error: err.message,
    });
  }
});

// DELETE - user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    if (!userId || typeof userId !== "string") {
      return res.status(400).send({
        status: "fail",
        message: "A valid userId must be provided",
      });
    }

    const deletedUser = await User.findByIdAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).send({
        status: "fail",
        message: "User not found or already deleted",
      });
    }

    res.status(200).send({
      status: "delete",
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(404).send("Something went wrong: " + err.message);
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
