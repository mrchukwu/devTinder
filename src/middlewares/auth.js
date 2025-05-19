 const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked!!");
    const toekn = "xyz";
    const isAdminAuthorized = toekn === "xyz";
    if(!isAdminAuthorized){
        res.status.send("unauthorized request");
    }else{
        next()
    }
}
 const userAuth = (req, res, next) => {
    console.log("User auth is getting checked!!");
    const toekn = "xyz";
    const isAdminAuthorized = toekn === "xyz";
    if(!isAdminAuthorized){
        res.status.send("unauthorized request");
    }else{
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}