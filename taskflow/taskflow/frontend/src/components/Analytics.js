import React, { useState, useEffect } from 'react';

function Analytics({ apiCall }) {
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
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>Failed to load analytics</div>;
  }

  return (
    <div>
      <h1>Analytics</h1>

      <div className="grid">
        <div className="card stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{analytics.totalTasks}</div>
          <div className="stat-label">Total Tasks Created</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{analytics.completedTasks}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{analytics.pendingTasks}</div>
          <div className="stat-label">Tasks Pending</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{analytics.completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Priority Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>High Priority</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '100px', height: '20px', backgroundColor: '#e5e7eb', borderRadius: '10px' }}>
                  <div
                    style={{
                      width: `${(analytics.priorityStats.high / analytics.totalTasks) * 100}%`,
                      height: '100%',
                      backgroundColor: '#ef4444',
                      borderRadius: '10px'
                    }}
                  ></div>
                </div>
                <span style={{ fontWeight: 'bold' }}>{analytics.priorityStats.high}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Medium Priority</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '100px', height: '20px', backgroundColor: '#e5e7eb', borderRadius: '10px' }}>
                  <div
                    style={{
                      width: `${(analytics.priorityStats.medium / analytics.totalTasks) * 100}%`,
                      height: '100%',
                      backgroundColor: '#f59e0b',
                      borderRadius: '10px'
                    }}
                  ></div>
                </div>
                <span style={{ fontWeight: 'bold' }}>{analytics.priorityStats.medium}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Low Priority</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '100px', height: '20px', backgroundColor: '#e5e7eb', borderRadius: '10px' }}>
                  <div
                    style={{
                      width: `${(analytics.priorityStats.low / analytics.totalTasks) * 100}%`,
                      height: '100%',
                      backgroundColor: '#10b981',
                      borderRadius: '10px'
                    }}
                  ></div>
                </div>
                <span style={{ fontWeight: 'bold' }}>{analytics.priorityStats.low}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Weekly Activity</h2>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {analytics.tasksThisWeek}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Tasks created this week</div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Status Overview</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#10b981' }}>✅</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.completedTasks}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#f59e0b' }}>⏳</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.pendingTasks}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;