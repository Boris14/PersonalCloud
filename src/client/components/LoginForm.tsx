import React, { useState } from 'react';
import '../styles/authform.css'
import { FiMail, FiLock } from 'react-icons/fi';

import { Button } from 'antd';

export interface LoginData {
  email: string;
  password: string;
}


interface LoginFormProps {
  onLogin: (loginData: LoginData) => Promise<boolean>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required!');
      return;
    }

    const loginSuccess = await onLogin({ email, password });
    if (!loginSuccess) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="auth-form">
      <h2>Your Personal Cloud</h2>
      <p>Sign in to your account to store, share, and collaborate on files and folders.</p>
      <hr />
      <br />
      {error && <p className="auth-form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="auth-form-input-group">
          <FiMail className="auth-form-icon" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-form-input" required />
        </div>
        <div className="auth-form-input-group">
          <FiLock className="auth-form-icon" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-form-input" required />
        </div>
        <div className="auth-form-submit">
          <Button type="primary" onClick={handleSubmit}>Sign In</Button>
        </div>
        <div className="auth-form-links">
          <p className="question">Don't have an account?</p>
          <a href="/register" className="auth-form-link">Register</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
