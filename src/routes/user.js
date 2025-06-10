const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills" ]);

        res.status(200).json({
            status: "success",
            data: connectionRequests
        })
    }catch(err){
        res.status(404).json("Error: " + err.message);
    }
})


module.exports = userRouter;