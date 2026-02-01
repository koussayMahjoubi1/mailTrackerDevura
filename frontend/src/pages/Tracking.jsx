import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackingService } from '../services/trackingService';
import { config } from '../config/env.js';
import './Tracking.css';

function Tracking() {
  const navigate = useNavigate();
  const [pixels, setPixels] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pixels');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: null, id: null, name: null });
  const [testPixelId, setTestPixelId] = useState(null);
  const [createForm, setCreateForm] = useState({ name: '', originalUrl: '' });
  const [deleting, setDeleting] = useState(false);
  // Initialize with backend URL (will be updated by loadTrackingConfig)
  const [publicTrackingUrl, setPublicTrackingUrl] = useState(null);

  useEffect(() => {
    loadData();
    loadTrackingConfig();
  }, []);

  const loadTrackingConfig = async () => {
    try {
      const configData = await trackingService.getTrackingConfig();
      if (configData.publicTrackingUrl) {
        setPublicTrackingUrl(configData.publicTrackingUrl);
        console.log('📡 Using public tracking URL:', configData.publicTrackingUrl);
      } else {
        // Fallback to backend API URL
        setPublicTrackingUrl(config.api.baseURL);
        console.warn('⚠️  No public tracking URL configured, using backend URL:', config.api.baseURL);
      }
    } catch (err) {
      console.warn('Failed to load tracking config, using backend URL:', err);
      setPublicTrackingUrl(config.api.baseURL);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [pixelsData, linksData] = await Promise.all([
        trackingService.getPixels(),
        trackingService.getLinks(),
      ]);
      setPixels(pixelsData);
      setLinks(linksData);
    } catch (err) {
      console.error('Failed to load tracking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePixel = async (e) => {
    e.preventDefault();
    try {
      const pixel = await trackingService.createPixel(createForm.name);
      setPixels([pixel, ...pixels]);
      setCreateForm({ name: '', originalUrl: '' });
      setShowCreateModal(false);
    } catch (err) {
      alert('Failed to create pixel: ' + err.message);
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!createForm.originalUrl) {
      alert('Please enter a URL');
      return;
    }
    try {
      const link = await trackingService.createLink(createForm.name, createForm.originalUrl);
      setLinks([link, ...links]);
      setCreateForm({ name: '', originalUrl: '' });
      setShowCreateModal(false);
    } catch (err) {
      alert('Failed to create link: ' + err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const testPixel = (pixelId) => {
    setTestPixelId(pixelId);
    setShowTestModal(true);
  };

  const handleDelete = (type, id, name) => {
    setItemToDelete({ type, id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      if (itemToDelete.type === 'pixel') {
        await trackingService.deletePixel(itemToDelete.id);
        setPixels(pixels.filter(p => p.pixel_id !== itemToDelete.id));
      } else {
        await trackingService.deleteLink(itemToDelete.id);
        setLinks(links.filter(l => l.link_id !== itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete({ type: null, id: null, name: null });
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const openTestPage = (pixelId) => {
    const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Tracking Pixel Test</title>
    <style>
        body {
            font-family: monospace;
            padding: 2rem;
            background: #1a1a1a;
            color: #e0e0e0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #2a2a2a;
            padding: 2rem;
            border: 1px solid #00ffff;
        }
        h1 { color: #00ffff; }
        .pixel-box {
            background: #1a1a1a;
            border: 2px dashed #00ffff;
            padding: 2rem;
            text-align: center;
            margin: 2rem 0;
        }
        .pixel-box img {
            border: 1px solid #00ffff;
            background: #0a0a0a;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tracking Pixel Test Page</h1>
        <p>This page contains your tracking pixel in TEST MODE. It will trigger a notification even though you're the creator.</p>
        <div class="pixel-box">
            <p>Tracking pixel below (1x1 transparent image):</p>
            <img src="${getPixelUrl(pixelId, true)}" width="1" height="1" alt="Tracking Pixel" />
            <p style="margin-top: 1rem; color: #00ff88;">✓ Pixel loaded - check your notifications!</p>
        </div>
        <p><strong>How to test:</strong></p>
        <ol>
            <li>View this page (the pixel loads automatically)</li>
            <li>Go back to DevuraTracker → Notifications or History Logs</li>
            <li>You should see a notification and an "open" event recorded</li>
        </ol>
    </div>
</body>
</html>`;
    const blob = new Blob([testHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const getPixelUrl = (pixelId, forceTest = false) => {
    const baseUrl = `${publicTrackingUrl}/api/tracking/pixel/${pixelId}`;
    return forceTest ? `${baseUrl}?force_test=true` : baseUrl;
  };

  const getLinkUrl = (linkId) => {
    return `${publicTrackingUrl}/api/tracking/link/${linkId}`;
  };

  if (loading || !publicTrackingUrl) {
    return <div className="loading">Loading tracking assets...</div>;
  }

  return (
    <div className="tracking">
      <div className="tracking-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/homepage')}>
            ← Back
          </button>
          <h1>Tracking Assets</h1>
        </div>
        <button
          className="create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          Create {activeTab === 'pixels' ? 'Pixel' : 'Link'}
        </button>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'pixels' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('pixels')}
        >
          Tracking Pixels
        </button>
        <button
          className={activeTab === 'links' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('links')}
        >
          Tracking Links
        </button>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create {activeTab === 'pixels' ? 'Tracking Pixel' : 'Tracking Link'}</h2>
            <form onSubmit={activeTab === 'pixels' ? handleCreatePixel : handleCreateLink}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                  placeholder="e.g., Newsletter Campaign"
                />
              </div>
              {activeTab === 'links' && (
                <div className="form-group">
                  <label>Original URL</label>
                  <input
                    type="url"
                    value={createForm.originalUrl}
                    onChange={(e) => setCreateForm({ ...createForm, originalUrl: e.target.value })}
                    required
                    placeholder="https://example.com"
                  />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTestModal && testPixelId && (
        <div className="modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="modal-content test-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Test Tracking Pixel</h2>
            <div className="test-info">
              <p>Click the button below to open a test HTML page with your tracking pixel embedded.</p>
              <p>When the page loads, it will automatically fire a tracking event.</p>
              <div className="pixel-preview">
                <div className="preview-box">
                  <img
                    src={getPixelUrl(testPixelId, true)}
                    width="1"
                    height="1"
                    alt="Tracking Pixel"
                    onLoad={() => console.log('Test pixel loaded - notification should fire!')}
                  />
                  <span>1x1 transparent pixel (test mode)</span>
                </div>
              </div>
              <div className="test-actions">
                <button
                  className="test-open-btn"
                  onClick={() => openTestPage(testPixelId)}
                >
                  Open Test Page
                </button>
                <button
                  className="test-direct-btn"
                  onClick={() => window.open(getPixelUrl(testPixelId), '_blank')}
                >
                  Open Pixel URL Directly
                </button>
              </div>
              <div className="test-steps">
                <p><strong>Testing steps:</strong></p>
                <ol>
                  <li>Click "Open Test Page" above</li>
                  <li>A new tab will open with the pixel embedded</li>
                  <li>Go to History Logs in DevuraTracker</li>
                  <li>You should see an "open" event appear</li>
                </ol>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowTestModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pixels' ? (
        <div className="assets-list">
          {pixels.length === 0 ? (
            <div className="empty-state">
              <p>No tracking pixels yet. Create one to get started!</p>
            </div>
          ) : (
            pixels.map((pixel) => (
              <div key={pixel.id} className="asset-card">
                <div className="asset-header">
                  <h3>{pixel.name}</h3>
                  <span className="asset-type">Pixel</span>
                </div>
                <div className="asset-info">
                  <div className="info-row">
                    <label>Tracking URL:</label>
                    <div className="url-display">
                      <code>{getPixelUrl(pixel.pixel_id)}</code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(getPixelUrl(pixel.pixel_id))}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="info-row">
                    <label>HTML Code:</label>
                    <div className="url-display">
                      <code>{`<img src="${getPixelUrl(pixel.pixel_id)}" width="1" height="1" />`}</code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(`<img src="${getPixelUrl(pixel.pixel_id)}" width="1" height="1" />`)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="info-row">
                    <label>Created:</label>
                    <span>{new Date(pixel.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="asset-actions">
                    <button
                      className="test-btn"
                      onClick={() => testPixel(pixel.pixel_id)}
                    >
                      Test Pixel
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete('pixel', pixel.pixel_id, pixel.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="assets-list">
          {links.length === 0 ? (
            <div className="empty-state">
              <p>No tracking links yet. Create one to get started!</p>
            </div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="asset-card">
                <div className="asset-header">
                  <h3>{link.name}</h3>
                  <span className="asset-type">Link</span>
                </div>
                <div className="asset-info">
                  <div className="info-row">
                    <label>Original URL:</label>
                    <span>{link.original_url}</span>
                  </div>
                  <div className="info-row">
                    <label>Tracking URL:</label>
                    <div className="url-display">
                      <code>{getLinkUrl(link.link_id)}</code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(getLinkUrl(link.link_id))}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="info-row">
                    <label>Created:</label>
                    <span>{new Date(link.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="asset-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete('link', link.link_id, link.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete {itemToDelete.type === 'pixel' ? 'Pixel' : 'Link'}</h2>
            <div className="delete-warning">
              <p>Are you sure you want to permanently delete:</p>
              <p className="delete-item-name">{itemToDelete.name}</p>
              <p className="delete-warning-text">This action cannot be undone. All associated events will also be deleted.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracking;

