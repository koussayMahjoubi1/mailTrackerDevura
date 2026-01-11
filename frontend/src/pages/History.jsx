import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import './History.css';

function History() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadEvents();
  }, [dateRange]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMetrics(
        dateRange.startDate || undefined,
        dateRange.endDate || undefined
      );
      setEvents(data.recentEvents || []);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/homepage')}>
            ← Back
          </button>
          <div>
            <h1>History Logs</h1>
            <p className="subtitle">Event Logs & Signal History</p>
          </div>
        </div>
      </div>

      <div className="filters-panel">
        <div className="section-label">
          <span>Filters</span>
        </div>
        <div className="filters">
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="logs-panel">
        <div className="section-label">
          <span>Event Logs</span>
        </div>
        {loading ? (
          <div className="loading-state">Loading logs...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">No events found</div>
        ) : (
          <div className="logs-list">
            {events.map((event) => (
              <div key={event.id} className={`log-entry log-${event.event_type}`}>
                <div className="log-timestamp">
                  {new Date(event.created_at).toLocaleString()}
                </div>
                <div className="log-type">
                  <span className={`type-badge type-${event.event_type}`}>
                    {event.event_type.toUpperCase()}
                  </span>
                </div>
                <div className="log-meta">
                  <span>IP: {event.metadata?.ip || 'N/A'}</span>
                  <span>UA: {event.metadata?.userAgent?.substring(0, 30) || 'N/A'}...</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;

