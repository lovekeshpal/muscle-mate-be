const express = require("express");
const { signup, login } = require("../controllers/userController");
const authenticateJWT = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

module.exports = router;
