import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';  // Import Register component
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import PractitionerDashboard from './components/PractitionerDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> {}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={[1]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute roles={[3]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/practitioner"
            element={
              <PrivateRoute roles={[2]}>
                <PractitionerDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
