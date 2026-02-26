import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTossModal, setShowTossModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [tossData, setTossData] = useState({
    tossWinner: '',
    tossDecision: ''
  });
  const [formData, setFormData] = useState({
    matchNumber: '',
    team1: '',
    team2: '',
    venue: '',
    date: '',
    totalOvers: 6
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data } = await API.get('/matches');
      setMatches(data.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data } = await API.get('/teams');
      setTeams(data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/matches', formData);
      setFormData({
        matchNumber: '',
        team1: '',
        team2: '',
        venue: '',
        date: '',
        totalOvers: 6
      });
      setShowForm(false);
      fetchMatches();
      alert('Match created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating match');
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatch = (match) => {
    setSelectedMatch(match);
    setTossData({
      tossWinner: match.team1._id,
      tossDecision: 'bat'
    });
    setShowTossModal(true);
  };

  const handleTossSubmit = async () => {
    if (!tossData.tossWinner || !tossData.tossDecision) {
      alert('Please select both toss winner and decision');
      return;
    }

    setLoading(true);
    try {
      await API.put(`/matches/${selectedMatch._id}/toss`, {
        tossWinner: tossData.tossWinner,
        tossDecision: tossData.tossDecision
      });
      alert('Match started! Redirecting to scoring...');
      setShowTossModal(false);
      fetchMatches();
      navigate(`/admin/scoring/${selectedMatch._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error starting match');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    const confirmed = confirm('Delete this live match? This action cannot be undone.');
    if (!confirmed) return;

    setLoading(true);
    try {
      await API.delete(`/matches/${matchId}`);
      alert('Match deleted successfully');
      fetchMatches();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting match');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'text-blue-500',
      live: 'text-red-500',
      completed: 'text-green-500',
      abandoned: 'text-gray-500'
    };
    return colors[status] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-6xl font-display gradient-text">MANAGE MATCHES</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="brutalist-btn-primary text-sm"
          >
            {showForm ? '✕ CLOSE' : '+ NEW MATCH'}
          </button>
        </div>

        {/* Create Match Form */}
        {showForm && (
          <div className="brutalist-card mb-8">
            <h2 className="text-2xl font-bold mb-6 uppercase">Schedule New Match</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Match Number</label>
                  <input
                    type="number"
                    value={formData.matchNumber}
                    onChange={(e) => setFormData({ ...formData, matchNumber: e.target.value })}
                    required
                    className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Total Overs</label>
                  <input
                    type="number"
                    value={formData.totalOvers}
                    onChange={(e) => setFormData({ ...formData, totalOvers: Number(e.target.value) })}
                    required
                    min="1"
                    max="50"
                    className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                    placeholder="6"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Team 1</label>
                  <select
                    value={formData.team1}
                    onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                    required
                    className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Team 2</label>
                  <select
                    value={formData.team2}
                    onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                    required
                    className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  required
                  className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  placeholder="e.g., BGMIT Main Ground"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                />
              </div>

              <button type="submit" disabled={loading} className="brutalist-btn-primary w-full">
                {loading ? 'CREATING...' : '→ CREATE MATCH'}
              </button>
            </form>
          </div>
        )}

        {/* Matches List */}
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match._id} className="brutalist-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-display text-primary">Match {match.matchNumber}</span>
                    <span className={`text-sm font-bold uppercase ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                  </div>
                  <div className="text-lg mb-1">
                    <span className="font-bold">{match.team1.shortName}</span>
                    <span className="text-gray-500 mx-2">vs</span>
                    <span className="font-bold">{match.team2.shortName}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {match.venue} • {new Date(match.date).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  {match.status === 'scheduled' && (
                    <button
                      onClick={() => handleStartMatch(match)}
                      className="brutalist-btn-primary text-sm"
                    >
                      START MATCH
                    </button>
                  )}
                  {match.status === 'live' && (
                    <>
                      <button
                        onClick={() => navigate(`/admin/scoring/${match._id}`)}
                        className="brutalist-btn-primary text-sm bg-red-600 border-red-600"
                      >
                        GO TO SCORING
                      </button>
                      <button
                        onClick={() => handleDeleteMatch(match._id)}
                        className="brutalist-btn-secondary text-sm border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        DELETE MATCH
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {matches.length === 0 && !showForm && (
          <div className="brutalist-card text-center py-12">
            <p className="text-xl text-gray-400 mb-4">No matches yet</p>
            {teams.length >= 2 ? (
              <button onClick={() => setShowForm(true)} className="brutalist-btn-primary">
                + SCHEDULE FIRST MATCH
              </button>
            ) : (
              <p className="text-sm text-gray-500">Need at least 2 teams to create a match</p>
            )}
          </div>
        )}
      </div>

      {/* Toss Modal */}
      {showTossModal && selectedMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="brutalist-border bg-dark p-8 w-full max-w-md">
            <h2 className="text-3xl font-display gradient-text mb-6">MATCH TOSS</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider">
                Toss Winner Team
              </label>
              <select
                value={tossData.tossWinner}
                onChange={(e) => setTossData({ ...tossData, tossWinner: e.target.value })}
                className="w-full bg-dark-light border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
              >
                <option value={selectedMatch.team1._id} className="bg-dark-light">
                  {selectedMatch.team1.name}
                </option>
                <option value={selectedMatch.team2._id} className="bg-dark-light">
                  {selectedMatch.team2.name}
                </option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider">
                Toss Decision
              </label>
              <select
                value={tossData.tossDecision}
                onChange={(e) => setTossData({ ...tossData, tossDecision: e.target.value })}
                className="w-full bg-dark-light border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
              >
                <option value="bat" className="bg-dark-light">Bat</option>
                <option value="bowl" className="bg-dark-light">Bowl</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTossSubmit}
                disabled={loading}
                className="flex-1 brutalist-btn-primary"
              >
                {loading ? 'STARTING...' : '→ START MATCH'}
              </button>
              <button
                onClick={() => setShowTossModal(false)}
                disabled={loading}
                className="flex-1 brutalist-btn-secondary"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatches;
