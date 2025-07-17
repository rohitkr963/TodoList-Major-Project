const Todo = require("../models/Todo");

// ✅ Get all todos for logged-in user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Add a new todo
exports.addTodo = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ msg: "Todo text is required" });

  try {
    const newTodo = new Todo({
      user: req.user.id,
      text,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a todo
// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    // Find and delete the todo in one operation
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({ msg: "Todo not found or unauthorized" });
    }

    res.json({ msg: "Todo deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// ✅ Toggle complete status OR edit text
exports.toggleComplete = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Todo not found or unauthorized" });
    }

    if (req.body.text !== undefined) {
      // Edit text if provided
      todo.text = req.body.text;
    } else {
      // Toggle completed if no text
      todo.completed = !todo.completed;
    }

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
