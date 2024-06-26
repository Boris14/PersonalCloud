import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiKey, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Button } from 'antd';
import UserData from '../../../../back-end/interfaces/UserData';

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
  color: #4a4a4a;
  margin-bottom: 1rem;
`;

const AuthFormDescription = styled.p`
  font-size: 1rem;
  color: #4a4a4a;
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

const AuthFormIcon = styled(FiUser)`
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
    color: #000;
  }
`;

export interface RegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  onRegister: (userData: UserData) => Promise<boolean>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isEmailValid = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const isNameValid = (name: string): boolean => {
    return /^[а-яА-Яa-zA-Z-]+$/.test(name);
  };

  const isPasswordStrong = (password: string): boolean => {
    return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setError('All fields are required!');
      return;
    }

    if (!isEmailValid(email)) {
      setError('Invalid email format!');
      return;
    }
    if (!isNameValid(firstName) || !isNameValid(lastName)) {
      setError('Invalid first name or last name!');
      return;
    }
    if (!isPasswordStrong(password)) {
      setError('Password must be at least 8 characters long and contain letters and at least one digit!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      const registerSuccess = await onRegister({ username, email, password });

      if (!registerSuccess) {
        setError('A user with that email already exists!');
      } else {
        console.log('Registration successful!');
      }
    } catch (error) {
      setError('Failed to register user. Please try again later.');
      console.error('Error occurred during registration:', error);
    }
  };

  return (
    <AuthFormContainer>
      <AuthFormWrapper>
        <AuthFormTitle>Your Personal Cloud</AuthFormTitle>
        <AuthFormDescription>Please fill in this form to create an account.</AuthFormDescription>
        <hr />
        <br />
        {error && <AuthFormError>{error}</AuthFormError>}
        <form onSubmit={handleSubmit}>
          <AuthFormGroup>
            <AuthFormIcon as={FiUser} />
            <AuthFormInput
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthFormIcon as={FiUser} />
            <AuthFormInput
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthFormIcon as={FiUser} />
            <AuthFormInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </AuthFormGroup>
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
          <AuthFormGroup>
            <AuthFormIcon as={FiKey} />
            <AuthFormInput
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </AuthFormGroup>
          <AuthFormSubmit>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Sign Up
            </Button>
          </AuthFormSubmit>
          <AuthFormLinks>
            <p className="question">Already have an account?</p>
            <ShakingLink href="/login">Sign In</ShakingLink>
          </AuthFormLinks>
        </form>
      </AuthFormWrapper>
    </AuthFormContainer>
  );
};

export default RegistrationForm;
