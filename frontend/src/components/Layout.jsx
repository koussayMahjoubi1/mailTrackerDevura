import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <div className="top-bar">
        <div className="user-info">
          <span className="user-label">USER:</span>
          <span className="user-email">{user?.email}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          LOGOUT
        </button>
      </div>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;

