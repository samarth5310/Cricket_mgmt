import { useEffect, useState } from 'react';
import API from '../../utils/api';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', shortName: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

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
      await API.post('/teams', formData);
      setFormData({ name: '', shortName: '' });
      setShowForm(false);
      fetchTeams();
      alert('Team created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating team');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      await API.delete(`/teams/${id}`);
      fetchTeams();
      alert('Team deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting team');
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-6xl font-display gradient-text">MANAGE TEAMS</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="brutalist-btn-primary text-sm"
          >
            {showForm ? '✕ CLOSE' : '+ NEW TEAM'}
          </button>
        </div>

        {/* Create Team Form */}
        {showForm && (
          <div className="brutalist-card mb-8">
            <h2 className="text-2xl font-bold mb-6 uppercase">Create New Team</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Short Name (Max 4 chars)</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value.toUpperCase() })}
                  required
                  maxLength={4}
                  className="w-full bg-dark border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none uppercase"
                  placeholder="e.g., CSE"
                />
              </div>
              <button type="submit" disabled={loading} className="brutalist-btn-primary w-full">
                {loading ? 'CREATING...' : '→ CREATE TEAM'}
              </button>
            </form>
          </div>
        )}

        {/* Teams List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team._id} className="brutalist-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-display text-primary">{team.shortName}</h3>
                  <p className="text-gray-400">{team.name}</p>
                </div>
                <button
                  onClick={() => handleDelete(team._id)}
                  className="text-red-500 hover:text-red-400 font-bold"
                >
                  DELETE
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Matches</div>
                  <div className="font-bold">{team.matchesPlayed}</div>
                </div>
                <div>
                  <div className="text-gray-400">Points</div>
                  <div className="font-bold text-primary">{team.points}</div>
                </div>
                <div>
                  <div className="text-gray-400">Players</div>
                  <div className="font-bold">{team.players.length}</div>
                </div>
                <div>
                  <div className="text-gray-400">NRR</div>
                  <div className={`font-bold ${team.nrr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {team.nrr > 0 ? '+' : ''}{team.nrr}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && !showForm && (
          <div className="brutalist-card text-center py-12">
            <p className="text-xl text-gray-400 mb-4">No teams yet</p>
            <button onClick={() => setShowForm(true)} className="brutalist-btn-primary">
              + CREATE FIRST TEAM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeams;
