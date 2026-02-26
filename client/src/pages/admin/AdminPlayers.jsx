import { useEffect, useState } from 'react';
import API from '../../utils/api';

const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    role: 'batsman'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data } = await API.get('/players');
      setPlayers(data.data);
    } catch (error) {
      console.error('Error fetching players:', error);
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
      await API.post('/players', formData);
      setFormData({ name: '', team: '', role: 'batsman' });
      setShowForm(false);
      fetchPlayers();
      alert('Player added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding player');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      await API.delete(`/players/${id}`);
      fetchPlayers();
      alert('Player deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting player');
    }
  };

  const handleSetCaptain = async (id) => {
    if (!confirm('Set this player as team captain?')) return;

    try {
      await API.put(`/players/${id}/captain`);
      alert('Captain updated successfully!');
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.message || 'Error setting captain');
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-6xl font-display gradient-text">MANAGE PLAYERS</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="brutalist-btn-primary text-sm"
          >
            {showForm ? '✕ CLOSE' : '+ NEW PLAYER'}
          </button>
        </div>

        {/* Add Player Form */}
        {showForm && (
          <div className="brutalist-card mb-8">
            <h2 className="text-2xl font-bold mb-6 uppercase">Add New Player</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Player Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Team</label>
                <select
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
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
                <label className="block text-sm font-bold mb-2 uppercase">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                >
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All-Rounder</option>
                  <option value="wicket-keeper">Wicket-Keeper</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="brutalist-btn-primary w-full">
                {loading ? 'ADDING...' : '→ ADD PLAYER'}
              </button>
            </form>
          </div>
        )}

        {/* Players List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player._id} className="brutalist-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{player.name}</h3>
                  <p className="text-sm text-gray-400">{player.team?.name}</p>
                  <p className="text-xs text-primary uppercase mt-1">{player.role}</p>
                </div>
                <div className="text-2xl">
                  {player.role === 'batsman' ? '🏏' : 
                   player.role === 'bowler' ? '⚡' :
                   player.role === 'all-rounder' ? '⭐' : '🧤'}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSetCaptain(player._id)}
                  className="flex-1 px-3 py-2 bg-primary/20 border-2 border-primary text-primary font-bold text-xs uppercase hover:bg-primary hover:text-dark transition"
                >
                  Set Captain
                </button>
                <button
                  onClick={() => handleDelete(player._id)}
                  className="px-3 py-2 bg-red-500/20 border-2 border-red-500 text-red-500 font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {players.length === 0 && !showForm && (
          <div className="brutalist-card text-center py-12">
            <p className="text-xl text-gray-400 mb-4">No players yet</p>
            {teams.length > 0 ? (
              <button onClick={() => setShowForm(true)} className="brutalist-btn-primary">
                + ADD FIRST PLAYER
              </button>
            ) : (
              <p className="text-sm text-gray-500">Create teams first to add players</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlayers;
