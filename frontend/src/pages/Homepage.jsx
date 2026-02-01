import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function getUnread() {
      try {
        const { notifications } = await notificationService.getNotifications();
        const unread = notifications.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to fetch unread count');
      }
    }
    getUnread();

    const channel = notificationService.subscribeToNotifications((newNotif) => {
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, []);

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
      id: 'dashboard',
      title: 'Analytics Dashboard',
      description: 'Detailed metrics and charts',
      icon: '>',
      route: '/dashboard',
      accent: 'green'
    },
    {
      id: 'alerts',
      title: unreadCount > 0 ? `Alerts (${unreadCount} New)` : 'Real-time Alerts',
      description: 'Your tracked event feed',
      icon: unreadCount > 0 ? '🔔' : '>',
      route: '/notifications',
      accent: unreadCount > 0 ? 'purple' : 'cyan'
    },
    {
      id: 'history',
      title: 'History Logs',
      description: 'Full event chronology',
      icon: '>',
      route: '/history',
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
          <span>{unreadCount > 0 ? '🚨 Priority Actions' : 'Quick Actions'}</span>
        </div>
        <div className="actions-grid">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className={`action-card action-${action.accent} ${action.id === 'alerts' && unreadCount > 0 ? 'pulse-card' : ''}`}
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

