import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './front-end/client/components/Navbar';
import LoginForm, { LoginData } from './front-end/client/components/LoginForm';
import Home from './front-end/client/components/Home';
import Dashboard from './front-end/client/components/Dashboard';
import YourFiles from './front-end/client/components/YourFiles';
import SharedWithMe from './front-end/client/components/SharedWithMe';
import RegistrationForm from './front-end/client/components/RegistrationForm';
import UserData from './back-end/interfaces/UserData';
import User from './back-end/models/User';


const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserInfo] = useState<User | null>(null);

  const handleLogin = async (loginData: LoginData) => {
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const { user, token } = await response.json();
        console.log(' User:', user);
        localStorage.setItem('jwtToken', token);
        setLoggedIn(true);
        setUserInfo(user);
        return true;
      } else if (response.status === 404) {
        console.error('User not found');
      } else if (response.status === 401) {
        console.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
    return false;
  };

  const handleRegister = async (userData: UserData) => {
    try {
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {;
        const { user, token } = await response.json();
        console.log('Registered User:', user);
        localStorage.setItem('jwtToken', token);
        setLoggedIn(true);
        setUserInfo(user);
        return true;
      } else if (response.status === 400 || response.status === 409) {
        console.log('User registration failed:', await response.text());
      }
    } catch (error) {
      console.log('Error during registration:', error);
    }
    return false;
  };

  const logout = () => {
    window.location.href = '/';
    setLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <Router>
      <div>
        <Navbar loggedIn={loggedIn} handleLogout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={loggedIn ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={loggedIn ? (
              <Dashboard username={userData?.username || ''} />
            ) : (
              <Navigate to="/login" />
            )}
          />
          {loggedIn && <Route path="/your-files" element={<YourFiles />} />}
          {loggedIn && <Route path="/shared-with-me" element={<SharedWithMe />} />}
          <Route path="/register" element={loggedIn ? <Navigate to="/dashboard" /> : <RegistrationForm onRegister={handleRegister} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
