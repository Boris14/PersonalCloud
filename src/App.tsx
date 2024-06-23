import React, { useState } from 'react';


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Navbar from './client/components/Navbar';
import LoginForm, { LoginData } from './client/components/LoginForm';
import Home from './client/components/Home';
import Dashboard from './client/components/Dashboard';
import YourFiles from './client/components/YourFiles';
import SharedWithMe from './client/components/SharedWithMe';
import RegistrationForm, { RegistrationData } from './client/components/RegistrationForm';

import { handleLogin } from './services/loginService';
import { handleRegister } from './services/registerService';
import { UserData, users } from './server/server';



const App: React.FC = () => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);


  const login = async (loginData: LoginData) => {
    const userAuthData = await handleLogin(loginData);
    //const user = users.find((u) => u.email === loginData.email);
    //const userData = getUserData(loginData.email);
    if (userAuthData) {
      setLoggedIn(true);
      //setUserInfo(user);
      return true;
    }
    return false;
  };


  const logout = () => {
    window.location.href = '/';
    setLoggedIn(false);
    setUserInfo(null);
  };

  const register = async (registrationData: RegistrationData) => {
    const userData = await handleRegister(registrationData);
    if (userData) {
      const newUser: UserData = {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        password: registrationData.password,
      };

      setLoggedIn(true);
      setUserInfo(newUser);
      return true;
    }
    return false;
  }


  return (
    <Router>
      <div>
        <Navbar loggedIn={loggedIn} handleLogout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={loggedIn ? <Navigate to="/dashboard" /> : <LoginForm onLogin={login} />} />
          {userInfo && userInfo.firstName && userInfo.lastName ? (
            <Route
              path="/dashboard"
              element={<Dashboard firstName={userInfo.firstName} lastName={userInfo.lastName} />}
            />
          ) : (
            <Route path="/dashboard" element={<Dashboard />} />)
          }
          {loggedIn && (<Route path="/your-files" element={<YourFiles />} />)}
          {loggedIn && (<Route path="/shared-with-me" element={<SharedWithMe />} />)}
          <Route path="/register" element={loggedIn ? <Navigate to="/dashboard" /> : <RegistrationForm onRegister={register} />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
