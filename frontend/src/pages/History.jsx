import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import './History.css';

function History() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: 'all', id: null });
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

  const handleDeleteRequest = (type, id = null) => {
    setConfirmModal({ show: true, type, id });
  };

  const confirmDelete = async () => {
    try {
      if (confirmModal.type === 'single' && confirmModal.id) {
        await dashboardService.deleteEvent(confirmModal.id);
        setEvents(prev => prev.filter(e => e.id !== confirmModal.id));
      } else if (confirmModal.type === 'all') {
        await dashboardService.clearAllEvents();
        setEvents([]);
      }
    } catch (err) {
      console.error('Deletion failed:', err);
    } finally {
      setConfirmModal({ show: false, type: 'all', id: null });
    }
  };

  return (
    <div className="history-page">
      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="modal-overlay">
          <div className="confirm-modal danger">
            <h3>⚠️ Confirm Permanent Deletion</h3>
            <p>
              {confirmModal.type === 'all'
                ? 'Are you sure you want to delete ALL tracking history? This will permanently wipe your analytical data.'
                : 'Are you sure you want to delete this event from the logs? It will be removed permanently.'}
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Cancel</button>
              <button className="confirm-btn-danger" onClick={confirmDelete}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

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
        <div className="header-actions">
          {events.length > 0 && (
            <button className="clear-logs-btn" onClick={() => handleDeleteRequest('all')}>
              🔥 Clear All Logs
            </button>
          )}
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
                <div className="log-main-info">
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
                    <span className="ua-detail" title={event.metadata?.userAgent}>
                      UA: {event.metadata?.userAgent?.substring(0, 40) || 'N/A'}...
                    </span>
                  </div>
                </div>
                <button
                  className="delete-log-btn"
                  onClick={() => handleDeleteRequest('single', event.id)}
                  title="Delete this entry"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
