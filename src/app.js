const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello World from Express...");
});

app.listen(3000, () => {
  console.log("Server successfully listening on port 3000");
});
