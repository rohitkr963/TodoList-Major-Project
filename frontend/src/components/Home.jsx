// components/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/authContext';
import TodoItem from './TodoItem';
import '../styles/todoStyles.css';

const Home = () => {
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // ✅ Fetch Todos when token changes
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get('/api/todos', {
          headers: {
            'x-auth-token': token
          }
        });
        setTodos(res.data);
      } catch (err) {
        console.error('Error fetching todos:', err.response?.data || err.message);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

  // ✅ Add Todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post('/api/todos', { text }, {
        headers: {
          'x-auth-token': token
        }
      });
      setTodos([res.data, ...todos]);
      setText('');
    } catch (err) {
      console.error('Error adding todo:', err.response?.data || err.message);
      alert("Failed to add todo. Are you logged in?");
    }
  };

  // ✅ Delete Todo (with token header)
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err.response?.data || err.message);
      alert("Failed to delete todo.");
    }
  };

  // ✅ Toggle Completed
  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, {}, {
        headers: {
          'x-auth-token': token
        }
      });
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch (err) {
      console.error('Error toggling todo:', err.response?.data || err.message);
    }
  };

  // ✅ Edit Todo Text
  const editTodo = async (id, newText) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, { text: newText }, {
        headers: {
          'x-auth-token': token
        }
      });
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch (err) {
      console.error("Error editing todo:", err.response?.data || err.message);
    }
  };

  return (
    <div className="todo-container">
      {isAuthenticated ? (
        <>
          <h2>Welcome, {user?.username} 👋</h2>
          <form onSubmit={addTodo} className="todo-form">
            <input
              type="text"
              placeholder="Enter a todo"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>

          <div className="todo-list">
            {todos.length === 0 ? (
              <p>No todos yet!</p>
            ) : (
              todos.map(todo => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onDelete={() => deleteTodo(todo._id)}
                  onToggle={() => toggleTodo(todo._id)}
                  onEdit={editTodo}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <div className="not-auth">
          <h2>Todo App 📝</h2>
          <p>Please login or register to manage your todos.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
