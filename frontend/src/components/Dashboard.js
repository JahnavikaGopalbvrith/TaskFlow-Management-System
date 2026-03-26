import React, { useState, useEffect } from 'react';

function Dashboard({ apiCall }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await apiCall('/analytics');
      setAnalytics(data.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!analytics) {
    return <div>Failed to load analytics</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="card stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{analytics.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{analytics.completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{analytics.pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{analytics.tasksThisWeek}</div>
          <div className="stat-label">This Week</div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Priority Distribution</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>High: {analytics.priorityStats.high}</div>
            <div>Medium: {analytics.priorityStats.medium}</div>
            <div>Low: {analytics.priorityStats.low}</div>
          </div>
        </div>
        <div className="card">
          <h2>Completion Rate</h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {analytics.completionRate}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;