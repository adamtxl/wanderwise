import React, { useState } from 'react';
import FileUpload from '../FileUpload/FileUpload';
import './AdminPage.css';

function AdminPage() {
  const [activeSection, setActiveSection] = useState('csv');

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <div className="admin-eyebrow">Admin</div>
        <h1 className="admin-title">Control Panel</h1>
        <p className="admin-subtitle">Site management tools — handle with care.</p>
      </div>

      {/* Nav tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeSection === 'csv' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveSection('csv')}
        >
          📂 CSV Upload
        </button>
        <button
          className={`admin-tab ${activeSection === 'users' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          👥 User Management
        </button>
        <button
          className={`admin-tab ${activeSection === 'system' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveSection('system')}
        >
          ⚙️ System
        </button>
      </div>

      {/* CSV Upload */}
      {activeSection === 'csv' && (
        <div className="admin-section">
          <div className="admin-section-heading">Upload Map Locations via CSV</div>
          <div className="admin-card">
            <div className="admin-schema">
              <div className="admin-schema-label">Required CSV columns</div>
              <div className="admin-schema-cols">
                {['name', 'description', 'latitude', 'longitude'].map((col) => (
                  <code key={col} className="admin-col-pill">{col}</code>
                ))}
              </div>
              <p className="admin-schema-note">
                Column names must match exactly — case sensitive. Any extra columns are ignored.
              </p>
            </div>
            <div className="admin-upload-area">
              <FileUpload />
            </div>
          </div>
        </div>
      )}

      {/* User Management — placeholder */}
      {activeSection === 'users' && (
        <div className="admin-section">
          <div className="admin-section-heading">User Management</div>
          <div className="admin-card admin-coming-soon">
            <div className="admin-coming-icon">🔧</div>
            <div className="admin-coming-title">Coming soon</div>
            <ul className="admin-coming-list">
              <li>Password reset by username or email</li>
              <li>View all registered users</li>
              <li>Revoke or promote user roles</li>
              <li>Delete accounts</li>
            </ul>
          </div>
        </div>
      )}

      {/* System — placeholder */}
      {activeSection === 'system' && (
        <div className="admin-section">
          <div className="admin-section-heading">System</div>
          <div className="admin-card admin-coming-soon">
            <div className="admin-coming-icon">⚙️</div>
            <div className="admin-coming-title">Coming soon</div>
            <ul className="admin-coming-list">
              <li>View error logs</li>
              <li>Database health check</li>
              <li>Clear stale sessions</li>
              <li>Trip category management</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
