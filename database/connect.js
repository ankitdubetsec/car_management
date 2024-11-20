const mongoose = require("mongoose");

const connectDb = (url) => {
  try {
    mongoose.connect(url);
    console.log("connected to database sucessfully");
  } catch (error) {
    console.log("error in connecting to database:", error);
  }
};

module.exports = connectDb;
