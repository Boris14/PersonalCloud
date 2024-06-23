import React from 'react';
import '../styles/home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome!</h1>
      <p className="home-description">This is your Personal Cloud application.
      <br/>
      Sign In/Sign Up to store, share, and collaborate on files and folders from your mobile device, tablet, or computer!
      </p>
    </div>
  );
};

export default Home;