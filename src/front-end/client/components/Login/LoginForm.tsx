import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiMail, FiLock } from 'react-icons/fi';
import { Button } from 'antd';

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const AuthFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #bde0fe; 
  padding: 2rem;
  box-sizing: border-box;
`;

const AuthFormWrapper = styled.div`
  background: #ffffff; 
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const AuthFormTitle = styled.h2`
  font-size: 2rem;
  color: #4a4a4a; /* dark grey */
  margin-bottom: 1rem;
`;

const AuthFormDescription = styled.p`
  font-size: 1rem;
  color: #4a4a4a; /* dark grey */
  margin-bottom: 1rem;
`;

const AuthFormError = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const AuthFormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
`;

const AuthFormIcon = styled(FiMail)`
  margin-right: 0.5rem;
`;

const AuthFormInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

const AuthFormSubmit = styled.div`
  margin: 1rem 0;
`;

const AuthFormLinks = styled.div`
  text-align: center;
`;

const ShakingLink = styled.a`
  color: #4a4a4a; /* dark grey */
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  transition: color 0.3s ease;

  &:hover {
    animation: ${shake} 0.5s linear;
    color: #1677ff;
  }
`;

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
  };

  return (
    <AuthFormContainer>
      <AuthFormWrapper>
        <AuthFormTitle>Your Personal Cloud</AuthFormTitle>
        <AuthFormDescription>
          Sign in to your account to store, share, and collaborate on files and folders.
        </AuthFormDescription>
        <hr />
        <br />
        {error && <AuthFormError>{error}</AuthFormError>}
        <form onSubmit={handleSubmit}>
          <AuthFormGroup>
            <AuthFormIcon as={FiMail} />
            <AuthFormInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthFormIcon as={FiLock} />
            <AuthFormInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </AuthFormGroup>
          <AuthFormSubmit>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Sign In
            </Button>
          </AuthFormSubmit>
          <AuthFormLinks>
            <p className="question">Don't have an account?</p>
            <ShakingLink href="/register">Register</ShakingLink>
          </AuthFormLinks>
        </form>
      </AuthFormWrapper>
    </AuthFormContainer>
  );
};

export default LoginForm;
