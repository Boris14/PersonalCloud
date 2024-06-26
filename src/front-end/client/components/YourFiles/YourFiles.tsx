import React from 'react';
import styled from 'styled-components';

const YourFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  text-align: center;
`;

const YourFilesTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const YourFiles: React.FC = () => {
  return (
    <YourFilesContainer>
      <YourFilesTitle>Your Files</YourFilesTitle>
    </YourFilesContainer>
  );
};

export default YourFiles;
