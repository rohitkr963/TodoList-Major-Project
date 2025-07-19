import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: type === 'register' ? '' : undefined
  });

  const navigate = useNavigate();
  const { email, password, name } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      navigate('/');
    } catch (err) {
      console.error(err);

      // Show error alert (handle object or string)
      if (typeof err === 'string') {
        alert(err);
      } else if (err?.response?.data?.msg) {
        alert(err.response.data.msg);
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="auth-form">
      <h1>{type === 'login' ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AuthForm;
