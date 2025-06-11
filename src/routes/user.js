const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills" ];

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", "firstName lastName photoUrl age gender about skills"); 

        res.status(200).json({
            status: "success",
            data: connectionRequests
        })
    }catch(err){
        res.status(404).json("Error: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);


        const connections = connectionRequests.map(connection => {
            const fromUserId = connection.fromUserId;
            const toUserId = connection.toUserId;

            if(fromUserId._id.toString() !== loggedInUser._id.toString()){
                return fromUserId;
            }else if(toUserId._id.toString() !== loggedInUser._id.toString()){
                return toUserId;
            }
        }).filter(user => user);

        res.status(200).json({
            status: "success",
            message: "all connections established",
            data: connections
        })

    }catch{
        res.status(400).json({
            status: "failed",
            message: "Error: " + err.message
        })
    }
})

module.exports = userRouter;