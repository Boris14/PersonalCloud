import React from 'react';
import '../styles/dashboard.css'; // Import the CSS file for styling

interface DashboardProps {
  username?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome
        {username ? `, ${username}!` : ', back!'}
      </h1>
      <p className="dashboard-description">
        {username ? `You can now store, share, and collaborate on files and folders!` : 'Start exploring your files and folders!'}
      </p>
    </div>
  );
};

export default Dashboard;

