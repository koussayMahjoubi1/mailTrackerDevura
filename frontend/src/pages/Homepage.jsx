import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'tracker',
      title: 'Tracker Activation',
      description: 'Generate tracking pixels and links',
      icon: '>',
      route: '/tracking',
      accent: 'cyan'
    },
    {
      id: 'history',
      title: 'History Logs',
      description: 'View event logs and signals',
      icon: '>',
      route: '/history',
      accent: 'green'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Analytics and metrics overview',
      icon: '>',
      route: '/dashboard',
      accent: 'green'
    }
  ];

  return (
    <div className="homepage">
      <div className="homepage-header">
        <h1>DevuraTracker</h1>
        <p className="subtitle">Email Tracking Lab</p>
      </div>

      <div className="quick-actions">
        <div className="section-label">
          <span>Quick Actions</span>
        </div>
        <div className="actions-grid">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className={`action-card action-${action.accent}`}
              onClick={() => navigate(action.route)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      <div className="status-panel">
        <div className="section-label">
          <span>System Status</span>
        </div>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">API</span>
            <span className="status-value status-online">ONLINE</span>
          </div>
          <div className="status-item">
            <span className="status-label">Database</span>
            <span className="status-value status-online">CONNECTED</span>
          </div>
          <div className="status-item">
            <span className="status-label">Tracking</span>
            <span className="status-value status-online">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;

