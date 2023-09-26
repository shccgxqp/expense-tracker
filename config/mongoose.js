const mongoose = require("mongoose");
require("dotenv").config();

let connectString = process.env.MONGODB_URI
  ? process.env.MONGODB_URI + "/expense-tracker"
  : "mongodb://127.0.0.1:27017/expense-tracker";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connectString);
    console.log(`Datebas connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
