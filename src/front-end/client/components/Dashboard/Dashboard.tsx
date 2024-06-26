import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0; 
  overflow: hidden; 
`;

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  color: #4a4a4a; /* dark grey */
  margin-bottom: 1rem;
`;

const DashboardDescription = styled.p`
  font-size: 1.25rem;
  color: #4a4a4a; /* dark grey */
  max-width: 600px;
  text-align: center;
`;

interface DashboardProps {
  username?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  return (
    <DashboardContainer>
      <DashboardTitle>
        Welcome{username ? `, ${username}!` : ', back!'}
      </DashboardTitle>
      <DashboardDescription>
        {username
          ? `You can now store, share, and collaborate on files and folders!`
          : 'Start exploring your files and folders!'}
      </DashboardDescription>
    </DashboardContainer>
  );
};

export default Dashboard;
