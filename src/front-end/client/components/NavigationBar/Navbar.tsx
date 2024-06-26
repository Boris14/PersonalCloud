import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Dropdown, Menu } from 'antd';

interface NavbarProps {
  loggedIn: boolean;
  handleLogout: () => void;
}

const NavbarContainer = styled.nav`
  background-color: #bde0fe;
  padding: 1rem 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
`;

const NavbarList = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: transform 0.3s ease;
`;

const NavbarItem = styled.li`
  margin-right: 2rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const NavbarLink = styled(Link)`
  color: #4a4a4a; /* dark grey */
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -3px;
    left: 0;
    background-color: #4a4a4a;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    color: #000;

    &::after {
      visibility: visible;
      transform: scaleX(1);
    }
  }
`;

const AccountButton = styled.button`
  background: transparent;
  border: 2px solid #4a4a4a;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #4a4a4a; /* dark grey */
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #000;
    border-color: #000;
    transform: translateY(-3px);
  }
`;

const Navbar: React.FC<NavbarProps> = ({ loggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="home" onClick={handleHome}>
        Home
      </Menu.Item>
      {loggedIn ? (
        <Menu.Item key="logout" onClick={handleLogoutClick}>
          Logout
        </Menu.Item>
      ) : (
        <Menu.Item key="login" onClick={handleSignIn}>
          Login
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <NavbarContainer>
      <NavbarList>
        {loggedIn && (
          <>
            <NavbarItem>
              <NavbarLink to="/dashboard">Dashboard</NavbarLink>
            </NavbarItem>
            <NavbarItem>
              <NavbarLink to="/your-files">Files</NavbarLink>
            </NavbarItem>
            <NavbarItem>
              <NavbarLink to="/shared-with-me">Shared With Me</NavbarLink>
            </NavbarItem>
          </>
        )}
      </NavbarList>
      <NavbarList>
        <Dropdown overlay={menu} trigger={['click']}>
          <AccountButton>Account</AccountButton>
        </Dropdown>
      </NavbarList>
    </NavbarContainer>
  );
};

export default Navbar;
