const express = require("express");
const app = express();


app.get("/user",(req, res) => {
  try{
    // throw Error("error")
    res.send("User data")

  }catch(err){
    console.log(err.message)
  }
}) 

app.use("/", (err, req, res, next) =>{
  if(err){
    res.status(500).send("Something went wrong!")
  }
} )


app.listen(3000, () => {
  console.log("Server successfully listening on port 3000");
});
