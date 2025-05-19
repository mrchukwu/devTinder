const express = require("express");
const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth")

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User data")
})


app.get("/admin/getAllData", (req, res) => {
  res.send("All data Sent")
})

app.get("/admin/delete", (req, res) => {
  res.send("Deleted user");
})

// app.get(/.*fly$/, (req, res) => {
//   console.log(req.params)
//   res.send({
//     firstname: "kennedy",
//     lastname: "chukwu"
//   });
// })

// app.get("/user", (req, res) => {
//   res.send("Hello from user route");
// });

// app.post("/user", (req, res) => {
//   res.send("Data successfuly saved to the database")
// })

// app.delete("/user", (req, res) => {
//   res.send("Deleted succesfully!")
// })

// app.use("/test", (req, res) => {
//   res.send("Hello from test route");
// });



app.listen(3000, () => {
  console.log("Server successfully listening on port 3000");
});
