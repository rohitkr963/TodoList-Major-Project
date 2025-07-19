import React, { useState } from 'react';

const TodoItem = ({ todo, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && newText.trim()) {
      onEdit(todo._id, newText);
    }
    setIsEditing(!isEditing);
  };

  const handleTextClick = () => {
    if (!isEditing) {
      onToggle();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Circular Checkbox */}
      <div 
        className={`checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={onToggle}
      >
        {todo.completed && <span className="checkmark">✓</span>}
      </div>

      {/* Todo Text - Now clickable to toggle completion */}
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="todo-edit-input"
          autoFocus
        />
      ) : (
        <span 
          className="todo-text"
          onClick={handleTextClick}
        >
          {todo.text}
        </span>
      )}

      {/* Action Buttons */}
      <div className="todo-actions">
        <button className="edit-btn" onClick={handleEdit}>
          {isEditing ? 'Save' : '✏️'}
        </button>
        <button className="delete-btn" onClick={onDelete}>🗑️</button>
      </div>
    </div>
  );
};

export default TodoItem;