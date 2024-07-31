require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already taken" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already taken" });
      }
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ error: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Find user by either username or email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      console.error("User not found");
      return res.status(400).json({ error: "User not found" });
    }

    // Log user details for debugging
    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Invalid credentials");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(400).json({ error: "Error logging in" });
  }
};

module.exports = { signup, login };
