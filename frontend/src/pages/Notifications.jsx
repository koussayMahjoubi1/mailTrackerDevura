import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { format } from 'date-fns';
import './Notifications.css';

function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ show: false, type: 'all', id: null });

    useEffect(() => {
        loadNotifications();

        // Subscribe to real-time updates
        const channel = notificationService.subscribeToNotifications((newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
        });

        return () => {
            if (channel) channel.unsubscribe();
        };
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const resp = await notificationService.getNotifications();
            setNotifications(resp.notifications || []);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleDeleteRequest = (type, id = null) => {
        setConfirmModal({ show: true, type, id });
    };

    const confirmDelete = async () => {
        try {
            if (confirmModal.type === 'single' && confirmModal.id) {
                await notificationService.deleteNotification(confirmModal.id);
                setNotifications(prev => prev.filter(n => n.id !== confirmModal.id));
            } else if (confirmModal.type === 'all') {
                await notificationService.deleteAllNotifications();
                setNotifications([]);
            }
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setConfirmModal({ show: false, type: 'all', id: null });
        }
    };

    const handleTestNotification = async () => {
        try {
            await notificationService.sendTestNotification();
        } catch (err) {
            console.error('Test notification failed', err);
        }
    };

    if (loading) return <div className="loading">Loading alerts...</div>;

    return (
        <div className="notifications-page">
            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h3>⚠️ Confirm Permanent Deletion</h3>
                        <p>
                            {confirmModal.type === 'all'
                                ? 'Are you sure you want to delete ALL notifications? This action cannot be undone.'
                                : 'Are you sure you want to delete this notification? It will be removed from the database permanently.'}
                        </p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmDelete}>Delete Permanently</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="notifications-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/homepage')}>← Back</button>
                    <h1>Alert Center</h1>
                </div>
                <div className="header-actions">
                    <button className="test-btn-alt" onClick={handleTestNotification}>⚡ Test Signal</button>
                    {notifications.length > 0 && (
                        <>
                            <button className="mark-all-btn" onClick={handleMarkAllAsRead}>Mark All Read</button>
                            <button className="clear-all-btn" onClick={() => handleDeleteRequest('all')}>Clear Everything</button>
                        </>
                    )}
                </div>
            </div>

            <div className="notifications-container">
                <div className="notifications-grid">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <div key={notif.id} className={`notif-card-full ${notif.is_read ? 'read' : 'unread'}`}>
                                <div className="notif-side-accent"></div>
                                <div className="notif-main-content">
                                    <div className="notif-meta">
                                        <span className={`notif-type-tag tag-${notif.type}`}>{notif.type}</span>
                                        <div className="notif-meta-right">
                                            <span className="notif-timestamp">{format(new Date(notif.created_at), 'MMM dd, HH:mm:ss')}</span>
                                            <button className="delete-item-btn" onClick={() => handleDeleteRequest('single', notif.id)}>×</button>
                                        </div>
                                    </div>
                                    <h3 className="notif-title-text">
                                        {notif.title}
                                        {!notif.is_read && <span className="unread-pulse"></span>}
                                    </h3>
                                    <p className="notif-body-text">{notif.message}</p>

                                    {!notif.is_read && (
                                        <button className="mark-read-btn" onClick={() => handleMarkAsRead(notif.id)}>
                                            Acknowledge
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📡</div>
                            <p>No activity detected. Your tracking signals will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notifications;
