import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [type, setType] = useState(3);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:3001/register', {
        username,
        password,
        type,
      });
      setSuccess('User registered successfully');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register user');
      alert('Failed to register user');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(Number(e.target.value))}>
            <option value={1}>Admin</option>
            <option value={2}>Practitioner</option>
            <option value={3}>User</option>
          </select>
        </div>
        <div className="form-group">
          <button type="submit">Register</button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
      <p className="login-link">Already have an account? <button className="login-button" onClick={() => navigate('/')}>Login here</button></p>
    </div>
  );
};

export default Register;
