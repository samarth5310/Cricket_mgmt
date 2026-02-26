import { useEffect, useState } from 'react';
import API from '../utils/api';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPlayers();
  }, [filter]);

  const fetchPlayers = async () => {
    try {
      const url = filter === 'all' ? '/players' : `/players?role=${filter}`;
      const { data } = await API.get(url);
      setPlayers(data.data);
    } catch (error) {
      console.error('Error fetching players:', error);
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
          PLAYERS
        </h1>

        {/* Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {['all', 'batsman', 'bowler', 'all-rounder', 'wicket-keeper'].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-6 py-2 font-bold uppercase border-2 transition ${
                filter === role
                  ? 'bg-primary border-primary text-dark'
                  : 'bg-transparent border-primary text-primary hover:bg-primary hover:text-dark'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player._id} className="brutalist-card hover:border-primary transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{player.name}</h3>
                  <p className="text-sm text-gray-400">{player.team?.name}</p>
                  <p className="text-xs text-primary uppercase mt-1">{player.role}</p>
                </div>
                <div className="text-3xl">
                  {player.role === 'batsman' ? '🏏' : 
                   player.role === 'bowler' ? '⚡' :
                   player.role === 'all-rounder' ? '⭐' : '🧤'}
                </div>
              </div>

              {/* Batting Stats */}
              {player.battingStats.innings > 0 && (
                <div className="mb-3 p-3 bg-dark border-2 border-primary/20">
                  <div className="text-xs text-gray-400 uppercase mb-2">Batting</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs">Runs</div>
                      <div className="font-bold text-primary">{player.battingStats.runs}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Avg</div>
                      <div className="font-bold">{player.battingStats.average}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">SR</div>
                      <div className="font-bold">{player.battingStats.strikeRate}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bowling Stats */}
              {player.bowlingStats.wickets > 0 && (
                <div className="p-3 bg-dark border-2 border-primary/20">
                  <div className="text-xs text-gray-400 uppercase mb-2">Bowling</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs">Wkts</div>
                      <div className="font-bold text-primary">{player.bowlingStats.wickets}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Econ</div>
                      <div className="font-bold">{player.bowlingStats.economy}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Best</div>
                      <div className="font-bold text-xs">{player.bowlingStats.bestFigures}</div>
                    </div>
                  </div>
                </div>
              )}

              {player.manOfTheMatchAwards > 0 && (
                <div className="mt-3 text-sm text-secondary">
                  🏆 {player.manOfTheMatchAwards} MOTM Award{player.manOfTheMatchAwards > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="brutalist-card text-center py-12">
            <p className="text-xl text-gray-400">No players found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
