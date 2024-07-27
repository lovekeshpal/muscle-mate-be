const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const signup = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = new User({ username, password });
      await user.save();
      res.status(201).send("User registered successfully");
    } catch (error) {
      res.status(400).send("Error registering user");
    }
  };
  
  const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send("User not found");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Invalid credentials");
      }
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
      res.send({ message: "Login successful", token });
    } catch (error) {
      res.status(400).send("Error logging in");
    }
  };
  
  module.exports = { signup, login };