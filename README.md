*Doumentation process*

Building a DevTinder in my learning journey.


**first created tested API's**
these API's were first version API's created for testing

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

app.get("/user", async (req, res) => {
 const userId = req.query._id;
 console.log(userId)
  if(!userId){
  return res.status(404)
    .send({
      status: "failed",
      message: "User ID rquired in parameter"
     })
   }

   try{
     const userFromDB = await User.find(userId);
     console.log("user from DB", userFromDB);
     if(!userFromDB){
       return res.status(404)
              .send({
         status: "failed",
         message: "User not found"
       })
       }
     res.status(200).send({
       status: "success",
       user: userFromDB
     })
   }catch(err){
     res.status(404)
     .send({
       status: "fail",
       message: "Error getting user: "
    })
   }
 })


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
