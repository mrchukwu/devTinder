const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const {userAuth} = require("../middlewares/auth");
const{validateProfileEditData, validatePasswordEdit} = require("../utils/validation")


profileRouter.get("/profile/view",userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async(req, res) =>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid edit request")
        }

        const loggedinUser = req.user;

        Object.keys(req.body).forEach(key => loggedinUser[key] = req.body[key]);

        await loggedinUser.save();

        res.send({
            status: "success",
            message: `${loggedinUser.firstName} profile updated sucessfully`,
            data: loggedinUser
        })
    }catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

profileRouter.patch("/profile/passwordUpdate", userAuth, async(req, res) => {
  try{

    validatePasswordEdit(req);

    const {oldPassword, newPassword} = req.body;
    const loggedinUser = req.user;
    if(!loggedinUser.password){
      throw new Error("User password not found.")
    }

    const isAMatch = await bcrypt.compare(oldPassword, loggedinUser.password);
    if(!isAMatch){
      throw new Error("Password incorrect"); 
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    loggedinUser.password = hashedNewPassword;
    await loggedinUser.save();

    res.send({
      status: "success",
      message: "Password updated successfully",
      data: loggedinUser
    })
  }catch(err){
    res.status(404).send("ERROR: " + err.message);
  }
})


  module.exports = profileRouter;