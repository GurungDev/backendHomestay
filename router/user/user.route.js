const express = require("express");
const UserModel = require("../../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
}

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone, address } = req.body;
    const hashed = await hashPassword(password);
    const newUser = new UserModel({
      firstname,
      lastname,
      email,
      password: hashed,
      phone,
      address,
    });
    await newUser.save();
    res.send("Sucessfull");
  } catch (error) {
    res.status(400).send(error?.message || "Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("user not found");
    }
    if (!password) {
      throw new Error("password not given");
    }
    const checkPassword = comparePassword(password, user.password);
    if (!checkPassword) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign({ id: user._id, username: user.username }, "secret");
    res.send(token);
  } catch (error) {
    res.status(400).send(error?.message || "Error");
  }
});

module.exports = router;
