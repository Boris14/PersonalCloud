import React from 'react';
import '../styles/dashboard.css'; // Import the CSS file for styling

interface DashboardProps {
  firstName?: string;
  lastName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ firstName, lastName }) => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome
        {firstName && lastName ? `, ${firstName} ${lastName}!` : ', back!'}
      </h1>
      <p className="dashboard-description">
        {firstName && lastName ? `You can now store, share, and collaborate on files and folders!` : 'Start exploring your files and folders!'}
      </p>
    </div>
  );
};

export default Dashboard;

