import React from 'react';

function Sidebar({ currentPage, onPageChange, user, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">🚀 TaskFlow</div>
      <nav className="sidebar-nav">
        <div
          className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onPageChange('dashboard')}
        >
          📊 Dashboard
        </div>
        <div
          className={`nav-link ${currentPage === 'tasks' ? 'active' : ''}`}
          onClick={() => onPageChange('tasks')}
        >
          ✅ Tasks
        </div>
        <div
          className={`nav-link ${currentPage === 'analytics' ? 'active' : ''}`}
          onClick={() => onPageChange('analytics')}
        >
          📈 Analytics
        </div>
      </nav>
      <div className="sidebar-user">
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{user.name}</div>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Sidebar;