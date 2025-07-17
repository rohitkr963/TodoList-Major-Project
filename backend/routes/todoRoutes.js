const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTodos,
  addTodo,
  deleteTodo,
  toggleComplete
} = require("../controllers/todoController");

router.get("/", authMiddleware, getTodos);
router.post("/", authMiddleware, addTodo);
router.delete("/:id", authMiddleware, deleteTodo);
router.put("/:id", authMiddleware, toggleComplete);

module.exports = router;
