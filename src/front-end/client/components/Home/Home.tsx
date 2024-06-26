import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  text-align: center;
`;

const HomeTitle = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
`;

const HomeDescription = styled.p`
  font-size: 1.25rem;
  color: #666;
  line-height: 1.5;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <HomeTitle>Welcome!</HomeTitle>
      <HomeDescription>
        This is your Personal Cloud application.
        <br />
        Sign In/Sign Up to store, share, and collaborate on files and folders from your mobile device, tablet, or computer!
      </HomeDescription>
    </HomeContainer>
  );
};

export default Home;
