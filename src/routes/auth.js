const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user")
const {validateSignupData, validateLoginData} = require("../utils/validation");


// POST - signup user
//runValidators - working on post/signup
authRouter.post("/signup", async (req, res) => {
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
        data: user
      });
    } catch (err) {
      res.status(400).send({
        status: "fail",
        message: err.message,
      });
    }
  });

  
authRouter.post("/login", async (req, res) => {
    try{
      validateLoginData(req)
  
      const {emailId, password} = req.body;
  
      const user = await User.findOne({emailId: emailId});
      if(!user){
        throw new Error("Invalid credentials");
      }
  
      const isPasswordValid = await user.validatePassword(password);
      if(isPasswordValid){
        //create a jwt
        const token = await user.getJWT();
        //cookie
        res.cookie("token", token, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
        
        res.status(200).send({
          status: "success",
          message: "Login successful",
          user
        });
      }else{
        throw new Error("Invalid credentials")
      }
  
    }catch(err){
      res.status(400).send({
        status: "fail",
        message: err.message,
      });
    }
  });

  authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send({
        message: "Logged out successfully"
    })
  })

  module.exports = authRouter;