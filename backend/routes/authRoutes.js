const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { register, login, getUser } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);

module.exports = router;
