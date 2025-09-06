import { AuthProvider, useAuth } from './context/authContext';
import './App.css';
import LoginForm from './components/auth/LoginForm';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="appContent">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<ProtectedRoute />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Navigate to="/login" />;
};

export default App;
