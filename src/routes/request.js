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

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
  try{
    const loggedInUser = req.user;
    const {status, requestId} = req.params;

    const allowedConnection = ["accepted", "rejected"];
    if(!allowedConnection.includes(status)){
      throw new Error("Invalid status request.")
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser.id,
      status: "interested"
    });

    if(!connectionRequest){
      throw new Error("Connection request not found");
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({
      status: "connection successful",
      message: `${loggedInUser.firstName} ${status === "accepted"? "accepted" : "rejected"} connection request.`,
      data
    })

  }catch(err){
    res.status(404).json("Error: " + err.message);
  }
})  


  module.exports = requestRouter;