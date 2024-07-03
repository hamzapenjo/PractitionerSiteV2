import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(2);
  const [practiceId, setPracticeId] = useState('');
  const [practitionerId, setPractitionerId] = useState('');
  const [practices, setPractices] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const usersResponse = await axios.get('http://localhost:3001/users', {
          headers: { Authorization: token },
        });
        setUsers(usersResponse.data);

        const practicesResponse = await axios.get('http://localhost:3001/practices', {
          headers: { Authorization: token },
        });
        setPractices(practicesResponse.data);

        const practitionersResponse = await axios.get('http://localhost:3001/users?type=2', {
          headers: { Authorization: token },
        });
        setPractitioners(practitionersResponse.data.filter(user => user.type === 2));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const userData = { username, password, type };
      if (type === 2) {
        userData.practice_id = practiceId;
      } else if (type === 3) {
        userData.practitioner_id = practitionerId;
      }
      if (editUserId) {
        await axios.put(`http://localhost:3001/users/${editUserId}`, userData, {
          headers: { Authorization: token },
        });
        setEditUserId(null);
      } else {
        await axios.post('http://localhost:3001/users', userData, {
          headers: { Authorization: token },
        });
      }
      setUsername('');
      setPassword('');
      setType(2);
      setPracticeId('');
      setPractitionerId('');
      const response = await axios.get('http://localhost:3001/users', {
        headers: { Authorization: token },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (user) => {
    setUsername(user.username);
    setType(user.type);
    setEditUserId(user._id);
    if (user.type === 2) {
      setPracticeId(user.practice_id);
    } else if (user.type === 3) {
      setPractitionerId(user.practitioner_id);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/users/${id}`, {
        headers: { Authorization: token },
      });
      const response = await axios.get('http://localhost:3001/users', {
        headers: { Authorization: token },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(Number(e.target.value))}>
            <option value={2}>Practitioner</option>
            <option value={3}>User</option>
          </select>
        </div>
        {type === 2 && (
          <div className="form-group">
            <label>Practice</label>
            <select value={practiceId} onChange={(e) => setPracticeId(e.target.value)}>
              <option value="">Select Practice</option>
              {practices.map((practice) => (
                <option key={practice._id} value={practice._id}>
                  {practice.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {type === 3 && (
          <div className="form-group">
            <label>Practitioner</label>
            <select value={practitionerId} onChange={(e) => setPractitionerId(e.target.value)}>
              <option value="">Select Practitioner</option>
              {practitioners.map((practitioner) => (
                <option key={practitioner._id} value={practitioner._id}>
                  {practitioner.username}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <button type="submit">{editUserId ? 'Update' : 'Create'} User</button>
        </div>
      </form>
      <h3>Users</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Type</th>
            <th>Practice</th>
            <th>Practitioner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.type === 2 ? 'Practitioner' : 'User'}</td>
              <td>{user.type === 2 ? user.practice_id?.name : ''}</td>
              <td>{user.type === 3 ? user.practitioner_id?.username : ''}</td>
              <td className="action-buttons">
                <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
