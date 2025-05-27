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
