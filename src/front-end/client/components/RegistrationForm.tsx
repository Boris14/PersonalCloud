import { useState } from "react";
import '../styles/authform.css'
import { FiKey, FiLock, FiMail, FiUser } from "react-icons/fi";

import { Button } from "antd";
import React from "react";
import UserData from "../../../back-end/interfaces/UserData";

export interface RegistrationData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string
}

interface RegistrationFormProps {
    onRegister: (userData : UserData) => Promise<boolean>;
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
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
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
        <div className="auth-form">
            <h2>Your Personal Cloud</h2>
            <p>Please fill in this form to create an account.</p>
            <hr />
            <br />
            {error && <p className="auth-form-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="auth-form-input-group">
                    <FiUser className="auth-form-icon" />
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="auth-form-input" required />
                </div>
                <div className="auth-form-input-group">
                    <FiUser className="auth-form-icon" />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="auth-form-input" required />
                </div>
                <div className="auth-form-input-group">
                    <FiUser className="auth-form-icon" />
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-form-input" required />
                </div>
                <div className="auth-form-input-group">
                    <FiMail className="auth-form-icon" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-form-input" required />
                </div>
                <div className="auth-form-input-group">
                    <FiLock className="auth-form-icon" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-form-input" required />
                </div>
                <div className="auth-form-input-group">
                    <FiKey className="auth-form-icon" />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-form-input" required />
                </div>
                <div className="auth-form-submit">
                    <Button type="primary" onClick={handleSubmit}>Sign Up</Button>
                </div>
                <div className="auth-form-links">
                    <p className="question">Already have an account?</p>
                    <a href="/login" className="auth-form-link">Sign In</a>
                </div>
            </form>
        </div>
    )
}

export default RegistrationForm;