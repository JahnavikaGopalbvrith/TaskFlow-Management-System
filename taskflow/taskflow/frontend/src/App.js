import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Analytics from './components/Analytics';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
    setupTheme();
  }, []);

  const setupTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return response.json();
  };

  const verifyToken = async (token) => {
    try {
      const data = await apiCall('/auth/me');
      setCurrentUser(data.user);
    } catch (err) {
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
    } catch (err) {
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (!currentUser) {
    return <Auth onLogin={login} onSignup={signup} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'tasks':
        return <Tasks apiCall={apiCall} />;
      case 'analytics':
        return <Analytics apiCall={apiCall} />;
      default:
        return <Dashboard apiCall={apiCall} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={currentUser}
        onLogout={logout}
      />
      <div className="main-content">
        <Topbar
          title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
        <div className="content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;