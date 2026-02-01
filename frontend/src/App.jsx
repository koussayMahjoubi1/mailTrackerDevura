import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import History from './pages/History';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <Navigate to="/homepage" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/homepage" element={
        <PrivateRoute>
          <Layout>
            <Homepage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/tracking" element={
        <PrivateRoute>
          <Layout>
            <Tracking />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/history" element={
        <PrivateRoute>
          <Layout>
            <History />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/notifications" element={
        <PrivateRoute>
          <Layout>
            <Notifications />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/homepage" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
