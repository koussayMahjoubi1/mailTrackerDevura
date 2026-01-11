import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      setError('Failed to load metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/homepage')}>
            ← Back
          </button>
          <h1>Dashboard</h1>
        </div>
        <div className="date-filters">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>
      </div>

      {metrics && (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Open Rate</h3>
              <div className="metric-value">{metrics.summary.openRate}%</div>
              <div className="metric-count">{metrics.summary.totalOpens} opens</div>
            </div>
            <div className="metric-card">
              <h3>Click Rate</h3>
              <div className="metric-value">{metrics.summary.clickRate}%</div>
              <div className="metric-count">{metrics.summary.totalClicks} clicks</div>
            </div>
            <div className="metric-card">
              <h3>Reply Rate</h3>
              <div className="metric-value">{metrics.summary.replyRate}%</div>
              <div className="metric-count">{metrics.summary.totalReplies} replies</div>
            </div>
            <div className="metric-card">
              <h3>Total Assets</h3>
              <div className="metric-value">{metrics.summary.totalPixels + metrics.summary.totalLinks}</div>
              <div className="metric-count">
                {metrics.summary.totalPixels} pixels, {metrics.summary.totalLinks} links
              </div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-card">
              <h2>Events Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.eventsByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="opens" stroke="#8884d8" name="Opens" />
                  <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                  <Line type="monotone" dataKey="replies" stroke="#ffc658" name="Replies" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Event Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.eventsByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="opens" fill="#8884d8" name="Opens" />
                  <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                  <Bar dataKey="replies" fill="#ffc658" name="Replies" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="recent-events">
            <h2>Recent Events</h2>
            <div className="events-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Time</th>
                    <th>IP</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentEvents.slice(0, 10).map((event) => (
                    <tr key={event.id}>
                      <td>
                        <span className={`event-badge event-${event.event_type}`}>
                          {event.event_type}
                        </span>
                      </td>
                      <td>{new Date(event.created_at).toLocaleString()}</td>
                      <td>{event.metadata?.ip || 'N/A'}</td>
                      <td className="user-agent">
                        {event.metadata?.userAgent?.substring(0, 50) || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

