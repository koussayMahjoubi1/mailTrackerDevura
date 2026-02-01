import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmModal, setConfirmModal] = useState({ show: false, type: 'all', id: null });
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMetrics(
        dateRange.startDate,
        dateRange.endDate
      );
      setMetrics(data);
      setError('');
    } catch (err) {
      setError('Failed to load analytical metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (type, id = null) => {
    setConfirmModal({ show: true, type, id });
  };

  const confirmDelete = async () => {
    try {
      if (confirmModal.type === 'single' && confirmModal.id) {
        await dashboardService.deleteEvent(confirmModal.id);
        // Refresh metrics to update counts and chart
        loadMetrics();
      } else if (confirmModal.type === 'all') {
        await dashboardService.clearAllEvents();
        loadMetrics();
      }
    } catch (err) {
      console.error('Deletion failed:', err);
    } finally {
      setConfirmModal({ show: false, type: 'all', id: null });
    }
  };

  if (loading) return <div className="loading">Analyzing tracking data...</div>;

  return (
    <div className="dashboard">
      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="modal-overlay">
          <div className="confirm-modal danger">
            <h3>⚠️ Confirm Permanent Deletion</h3>
            <p>
              {confirmModal.type === 'all'
                ? 'Clear ALL tracking events? This will reset your analytics and charts. This action is permanent.'
                : 'Delete this specific tracking event? This will update your charts and metrics immediately.'}
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Cancel</button>
              <button className="confirm-btn-danger" onClick={confirmDelete}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/homepage')}>← Back</button>
          <h1>Analytics Dashboard</h1>
        </div>
        <div className="header-actions">
          <button className="notif-shortcut-btn" onClick={() => navigate('/notifications')}>
            🔔 View Alerts
          </button>
          <div className="date-filters">
            <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} />
            <span>to</span>
            <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {error && <div className="metrics-error">⚠️ {error}</div>}

        {metrics ? (
          <>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Open Rate</h3>
                <div className="metric-value">{metrics.summary.openRate}%</div>
                <div className="metric-count">{metrics.summary.totalOpens} total opens</div>
              </div>
              <div className="metric-card">
                <h3>Click Rate</h3>
                <div className="metric-value">{metrics.summary.clickRate}%</div>
                <div className="metric-count">{metrics.summary.totalClicks} total clicks</div>
              </div>
              <div className="metric-card">
                <h3>Reply Rate</h3>
                <div className="metric-value">{metrics.summary.replyRate}%</div>
                <div className="metric-count">{metrics.summary.totalReplies} total replies</div>
              </div>
              <div className="metric-card">
                <h3>Total Assets</h3>
                <div className="metric-value">{metrics.summary.totalPixels + metrics.summary.totalLinks}</div>
                <div className="metric-count">
                  {metrics.summary.totalPixels} Pixels | {metrics.summary.totalLinks} Links
                </div>
              </div>
            </div>

            <div className="chart-wrapper">
              <div className="chart-card large">
                <h2>Engagement Trends</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={metrics.eventsByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #30363d' }}
                      itemStyle={{ color: '#00f2fe' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="opens" stroke="#00f2fe" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="clicks" stroke="#00ff88" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="replies" stroke="#bc00ff" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="recent-activity-section">
              <div className="section-header-flex">
                <h2>Chronological Events</h2>
                {metrics.recentEvents.length > 0 && (
                  <button className="clear-link-btn" onClick={() => handleDeleteRequest('all')}>
                    Clear Signal History
                  </button>
                )}
              </div>
              <div className="activity-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Time</th>
                      <th>Source IP</th>
                      <th>System Info</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentEvents.map((event) => (
                      <tr key={event.id}>
                        <td><span className={`type-dot ${event.event_type}`}></span>{event.event_type}</td>
                        <td>{new Date(event.created_at).toLocaleString()}</td>
                        <td>{event.metadata?.ip || 'Hidden'}</td>
                        <td className="ua-text" title={event.metadata?.userAgent}>
                          {event.metadata?.userAgent || 'N/A'}
                        </td>
                        <td>
                          <button
                            className="delete-row-btn"
                            onClick={() => handleDeleteRequest('single', event.id)}
                            title="Delete this event"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-metrics">
            No tracking data available for the selected period.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
