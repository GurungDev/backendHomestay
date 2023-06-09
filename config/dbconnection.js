const mongoose = require("mongoose");

const dbconnection = async () => {
  try {
    const db = await mongoose.connect("mongodb://127.0.0.1:27017/homestay");
    if (!db) {
      throw new Error("database not found");
    }
    console.log("Database Connected: ", db.connection.host);
  } catch (error) {
    console.log("Error Connection");
  }
};

module.exports = dbconnection;
