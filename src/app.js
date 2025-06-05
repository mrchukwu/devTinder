
const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(express.text({ type: "*/*" }));
app.use((req, res, next) => {
  console.log("Raw body:", req.body);
  next();
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server successfully listening on port 3000");
    });
    console.log("App.listen() has been called...");
  })
  .catch((err) => {
    console.error("Database cannot be connected!! ");
  });
