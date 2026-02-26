import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchLiveMatches();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/stats/overview');
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLiveMatches = async () => {
    try {
      const { data } = await API.get('/matches?status=live');
      setLiveMatches(data.data);
    } catch (error) {
      console.error('Error fetching live matches:', error);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-display text-center mb-12 gradient-text">
          ADMIN PANEL
        </h1>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="brutalist-card text-center">
              <div className="text-4xl font-display text-primary mb-2">{stats.totalTeams}</div>
              <div className="text-sm uppercase text-gray-400">Teams</div>
            </div>
            <div className="brutalist-card text-center">
              <div className="text-4xl font-display text-primary mb-2">{stats.totalPlayers}</div>
              <div className="text-sm uppercase text-gray-400">Players</div>
            </div>
            <div className="brutalist-card text-center">
              <div className="text-4xl font-display text-primary mb-2">{stats.totalMatches}</div>
              <div className="text-sm uppercase text-gray-400">Matches</div>
            </div>
            <div className="brutalist-card text-center">
              <div className="text-4xl font-display text-primary mb-2">{stats.liveMatches}</div>
              <div className="text-sm uppercase text-gray-400">Live</div>
            </div>
          </div>
        )}

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div className="brutalist-card mb-12">
            <h2 className="text-2xl font-display mb-6 text-primary uppercase">Live Matches</h2>
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <Link
                  key={match._id}
                  to={`/admin/scoring/${match._id}`}
                  className="block p-4 bg-dark border-2 border-red-600 hover:border-primary transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">
                        {match.team1.shortName} vs {match.team2.shortName}
                      </div>
                      <div className="text-sm text-gray-400">{match.venue}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                      <span className="font-bold text-red-600">LIVE</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/teams" className="brutalist-card hover:border-primary transition group text-center">
            <div className="text-5xl mb-4">🏏</div>
            <h3 className="text-xl font-bold group-hover:text-primary uppercase">Manage Teams</h3>
            <p className="text-sm text-gray-400 mt-2">Create & edit teams</p>
          </Link>

          <Link to="/admin/players" className="brutalist-card hover:border-primary transition group text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold group-hover:text-primary uppercase">Manage Players</h3>
            <p className="text-sm text-gray-400 mt-2">Add & manage players</p>
          </Link>

          <Link to="/admin/matches" className="brutalist-card hover:border-primary transition group text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold group-hover:text-primary uppercase">Manage Matches</h3>
            <p className="text-sm text-gray-400 mt-2">Schedule fixtures</p>
          </Link>

          <Link to="/matches?status=live" className="brutalist-card hover:border-primary transition group text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold group-hover:text-primary uppercase">Live Scoring</h3>
            <p className="text-sm text-gray-400 mt-2">Update match scores</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
