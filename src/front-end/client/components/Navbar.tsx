import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/navbar.css'
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { Radio } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

interface NavbarProps {
    loggedIn: boolean;
    handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn, handleLogout }) => {

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/login');
    };

    return (
        <nav className={`navbar ${loggedIn ? 'logged-in' : ''}`}>
            <ul className="navbar-list">
                {loggedIn ? (
                    <>
                        <li className="navbar-item">
                            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/your-files" className="navbar-link">Files</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/shared-with-me" className="navbar-link">Shared With Me</Link>
                        </li>
                        <li className="navbar-btn" style={{ float: 'right' }}>
                            <Radio.Button value="large" onClick={handleLogout}><FiLogOut style={{ color: 'black' }} /></Radio.Button>
                        </li>
                    </>
                ) : (
                    <li className="navbar-btn" style={{ float: 'right' }}>
                        <Radio.Button value="large" id="sign-in-btn" onClick={handleSignIn}><FiLogIn style={{ color: 'black' }} /></Radio.Button>
                    </li>
                )}
            </ul>
        </nav >
    );
};

export default Navbar;