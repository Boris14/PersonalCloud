import React from 'react';
import styled from 'styled-components';

const SharedWithMeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  text-align: center;
`;

const SharedWithMeTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const SharedWithMe: React.FC = () => {
  return (
    <SharedWithMeContainer>
      <SharedWithMeTitle>Shared with Me</SharedWithMeTitle>
    </SharedWithMeContainer>
  );
};

export default SharedWithMe;
