const jwt = require("jsonwebtoken");
const User = require("../models/user");


 const userAuth = async (req, res, next) => {
    try{

        const {token} = req.cookies;

        if(!token){
            return res.status(401).send("Please login!")
            // throw new Error("Invalid token!")
        }
        const decodedObj = await jwt.verify(token, "DEV@Tinder$770");

        const {_id} =  decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User no found");
        }

        req.user = user;
        
        next();

    }catch(err){
        res.status(404).send({
            status: "fail",
            message: "ERROR: " + err.message
        })
    }

}

module.exports = {
    userAuth
}