import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMatch from './pages/LiveMatch';
import PointsTable from './pages/PointsTable';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeams from './pages/admin/AdminTeams';
import AdminPlayers from './pages/admin/AdminPlayers';
import AdminMatches from './pages/admin/AdminMatches';
import AdminScoring from './pages/admin/AdminScoring';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/match/:id" element={<LiveMatch />} />
          <Route path="/points-table" element={<PointsTable />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/teams" element={
            <ProtectedRoute adminOnly>
              <AdminTeams />
            </ProtectedRoute>
          } />
          <Route path="/admin/players" element={
            <ProtectedRoute adminOnly>
              <AdminPlayers />
            </ProtectedRoute>
          } />
          <Route path="/admin/matches" element={
            <ProtectedRoute adminOnly>
              <AdminMatches />
            </ProtectedRoute>
          } />
          <Route path="/admin/scoring/:id" element={
            <ProtectedRoute adminOnly>
              <AdminScoring />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
