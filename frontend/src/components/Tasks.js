import React, { useState, useEffect } from 'react';

function Tasks({ apiCall }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await apiCall(`/tasks?${params}`);
      setTasks(data.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/tasks', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowCreateForm(false);
      loadTasks();
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiCall(`/tasks/${id}`, { method: 'DELETE' });
      loadTasks();
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      await apiCall(`/tasks/${id}/toggle`, { method: 'PATCH' });
      loadTasks();
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      high: 'badge-danger',
      medium: 'badge-warning',
      low: 'badge-success'
    };
    return `badge ${classes[priority]}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Task title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
          style={{ marginRight: '1rem' }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.priority || ''}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        {tasks.map(task => (
          <div key={task._id} className="task-card">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-badges">
                <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                <span className={`badge ${task.completed ? 'badge-success' : 'badge-warning'}`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
            {task.description && (
              <div className="task-description">{task.description}</div>
            )}
            <div className="task-footer">
              <div>
                {task.dueDate && `Due: ${formatDate(task.dueDate)}`}
              </div>
              <div className="task-actions">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleToggleTask(task._id)}
                >
                  {task.completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3>No tasks found</h3>
            <p>Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;