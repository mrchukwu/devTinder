const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth")

requestRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
  try{
    const fromUserId = req.user;
   
  }catch(err){
    res.status(400).send("Error: " + err.message)
  }
  
  })


  module.exports = requestRouter;