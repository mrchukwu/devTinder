const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
// const user = require("./models/user");

const app = express();

app.use(express.json());
app.use(express.text({ type: "*/*" }));
app.use((req, res, next) => {
  console.log("Raw body:", req.body);
  next();
});

// POST - signup user
//runValidators - working on post/signup
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).send({
      satus: "success",
      message: "User Added successfully",
      user: user
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: "Error saving the user: " + err.message,
    });
  }
});

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

// GET - user by ID
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

// //GET - user by ID
// app.get("/user", async (req, res) => {
//   const userId = req.body.userId;
//   console.log(userId)

//   try{
//     const user = await User.findById(userId);

//     if(!user){
//       return res.status(404)
//       .send({
//         status: "failed",
//         message: "Not User"
//       })
//     }
//     res.status(200).send({
//       status: "success",
//       user: user
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
    const isUpdatesAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
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
// app.patch("/user/:emailId", async (req, res) => {
//   const userEmail = req.params?.emailId;
//   const data = req.body;
//   console.log(data);

//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) {
//       return res.status(404).send({
//         status: "fail",
//         message: "User not found with provided email",
//       });
//     }

//     const ALLOWED_UPDATES = [ "gender", "photoUrl", "about", "skills"];
//     const isUpdatesAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k),
//     );

//     if (!isUpdatesAllowed) {
//       return res.status(404).send({
//         status: "fail",
//         message: "Invalid update field(s) detected",
//       });
//     }

//     const updatedUser = await User.findOneAndUpdate(
//       userEmail,
//       data,
//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     res.status(200).send({
//       status: "success",
//       message: "User successfully updated",
//       user: updatedUser,
//     });
//   } catch (err) {
//     res.status(404).send({
//       status: "fail",
//       message: "Error updating user",
//       error: err.message,
//     });
//   }
// });

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
