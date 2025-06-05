const express = require("express");
const profileRouter = express.Router();

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

    const loggedinUser = req.user.password;
    console.log(loggedinUser)

    res.send("Password updated...")
  }catch(err){
    res.status(404).send("ERROR: " + err.message);
  }
})


  module.exports = profileRouter;