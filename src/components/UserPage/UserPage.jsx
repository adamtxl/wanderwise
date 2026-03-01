import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';

function UserPage() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  return (
    <div className="up-wrapper">
      <div className="up-avatar">
        {user.username?.[0]?.toUpperCase()}
      </div>

      <h1 className="up-name">{user.first_name || user.username}</h1>
      <div className="up-username">@{user.username}</div>
      {user.email && <div className="up-email">{user.email}</div>}

      <div className="up-card">
        <div className="up-card-label">Account Details</div>
        <div className="up-detail">
          <span className="up-detail-label">Username</span>
          <span className="up-detail-value">{user.username}</span>
        </div>
        {user.first_name && (
          <div className="up-detail">
            <span className="up-detail-label">Name</span>
            <span className="up-detail-value">{user.first_name}</span>
          </div>
        )}
        {user.email && (
          <div className="up-detail">
            <span className="up-detail-label">Email</span>
            <span className="up-detail-value">{user.email}</span>
          </div>
        )}
      </div>

      <div className="up-actions">
        <button className="btn-up-primary" onClick={() => navigate('/trips')}>
          View My Trips →
        </button>
        <LogOutButton className="btn-up-ghost" />
      </div>
    </div>
  );
}

export default UserPage;
