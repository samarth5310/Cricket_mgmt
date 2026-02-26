import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data } = await API.get('/teams');
      setTeams(data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-display text-center mb-12 gradient-text">
          TEAMS
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team._id} className="brutalist-card hover:border-primary transition group">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-display group-hover:text-primary transition">
                    {team.shortName}
                  </h2>
                  <p className="text-gray-400">{team.name}</p>
                </div>
                <div className="text-4xl">🏏</div>
              </div>

              {team.captain && (
                <div className="mb-4 p-3 bg-dark border-2 border-primary/20">
                  <div className="text-xs text-gray-400 uppercase mb-1">Captain</div>
                  <div className="font-bold">{team.captain.name}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-400 uppercase">Matches</div>
                  <div className="text-xl font-bold">{team.matchesPlayed}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase">Points</div>
                  <div className="text-xl font-bold text-primary">{team.points}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase">Wins</div>
                  <div className="text-xl font-bold text-green-500">{team.wins}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase">NRR</div>
                  <div className={`text-xl font-bold ${team.nrr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {team.nrr > 0 ? '+' : ''}{team.nrr}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Squad: {team.players.length} players
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="brutalist-card text-center py-12">
            <p className="text-xl text-gray-400">No teams yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
