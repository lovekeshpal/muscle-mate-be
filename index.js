const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

/**
 * This is the main file for the Muscle Mate backend server.
 * It sets up an Express server and listens on the specified port.
 * @module index
 */

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);

// MongoDB Connection
connectDB();

/**
 * Starts the server and listens on the specified port.
 * @param {number} port - The port number to listen on.
 */
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
