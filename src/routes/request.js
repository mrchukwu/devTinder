const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");



requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try{
    const fromUserId = req.user;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedConnection = ["interested", "ignored"];
    if(!allowedConnection.includes(status)){
        throw new Error("Invalid connection request")
    }

    const toUser = await User.findById(toUserId);
    if(!toUser){
      throw new Error("User not found.");
    }

    const exstingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    });
    if(exstingConnectionRequest){
      return res.status(400).json({
        status: "exisiting connecion",
        message: "Connection request already exist!"
      })
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectionRequest.save();

    res.status(200).json({
      message: `${req.user.firstName} ${(status === "interested" ? "is interested in" : "ignored")} ${toUser.firstName}`,
      data
    })

  }catch(err){
    res.status(400).send("Error: " + err.message)
  }
  
  })


  module.exports = requestRouter;