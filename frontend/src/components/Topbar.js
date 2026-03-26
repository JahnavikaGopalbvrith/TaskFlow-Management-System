import React from 'react';

function Topbar({ title, onToggleTheme, isDarkMode }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <button className="theme-toggle" onClick={onToggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default Topbar;