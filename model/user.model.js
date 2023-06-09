const mongoose = require("mongoose");

const userModelSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: false,
    trim: true,
  },
  lastname: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unqiue: true,
    lowercase: true,
  },
  password: {
    type: String,
    unique: false,
    trim: true,
    required: true,
    minLength: 5,
  },
  phone: {
    type: Number,
    required: false,
    trim: true,
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
});

const UserModel = mongoose.model("user", userModelSchema);

module.exports = UserModel;
