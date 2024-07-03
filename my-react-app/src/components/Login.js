import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      localStorage.setItem('token', `Bearer ${response.data.token}`);
      localStorage.setItem('type', response.data.type);

      setSuccess('User registered successfully');
      
      if (response.data.type === 1) {
        navigate('/admin');
      } else if (response.data.type === 2) {
        navigate('/practitioner');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
      alert('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group button-container">
          <button type="submit">Login</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="register-link">
        <p>Don't have an account? <button onClick={() => navigate('/register')} className="register-button">Register</button></p>
      </div>
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default Login;
