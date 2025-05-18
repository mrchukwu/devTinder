const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send("Hello from user route");
});

app.post("/user", (req, res) => {
  res.send("Data successfuly saved to the database")
})

app.delete("/user", (req, res) => {
  res.send("Deleted succesfully!")
})

app.use("/test", (req, res) => {
  res.send("Hello from test route");
});



app.listen(3000, () => {
  console.log("Server successfully listening on port 3000");
});
