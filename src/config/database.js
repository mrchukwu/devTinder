 const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mrchukwusinbox:jEsrDxLXsnjZ4DEw@namastenodejs.21myjtm.mongodb.net/devTinder");
}

module.exports = connectDB;