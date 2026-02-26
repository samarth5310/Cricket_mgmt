import { useEffect, useState } from 'react';
import API from '../utils/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get('/stats/leaderboard');
      setLeaderboard(data.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
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
          LEADERBOARD
        </h1>

        {/* Player of the Tournament */}
        {leaderboard?.playerOfTournament && (
          <div className="brutalist-border bg-gradient-to-r from-primary to-secondary p-8 mb-12 text-dark">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-display mb-2">PLAYER OF THE TOURNAMENT</h2>
              <p className="text-5xl font-bold mb-2">{leaderboard.playerOfTournament.name}</p>
              <p className="text-xl mb-4">{leaderboard.playerOfTournament.team?.name}</p>
              <div className="flex justify-center gap-8 text-lg font-bold">
                <div>{leaderboard.playerOfTournament.runs} Runs</div>
                <div>{leaderboard.playerOfTournament.wickets} Wickets</div>
                <div>{leaderboard.playerOfTournament.motmAwards} MOTMs</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Run Scorers */}
          <div className="brutalist-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🟠</div>
              <h2 className="text-2xl font-display gradient-text">TOP RUN SCORERS</h2>
            </div>
            <div className="space-y-4">
              {leaderboard?.topRunScorers.slice(0, 5).map((player, index) => (
                <div key={player._id} className="flex items-center justify-between p-4 bg-dark border-2 border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-primary w-8">{index + 1}</div>
                    <div>
                      <div className="font-bold">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.team?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{player.battingStats.runs}</div>
                    <div className="text-xs text-gray-400">SR: {player.battingStats.strikeRate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Wicket Takers */}
          <div className="brutalist-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🟣</div>
              <h2 className="text-2xl font-display gradient-text">TOP WICKET TAKERS</h2>
            </div>
            <div className="space-y-4">
              {leaderboard?.topWicketTakers.slice(0, 5).map((player, index) => (
                <div key={player._id} className="flex items-center justify-between p-4 bg-dark border-2 border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-primary w-8">{index + 1}</div>
                    <div>
                      <div className="font-bold">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.team?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{player.bowlingStats.wickets}</div>
                    <div className="text-xs text-gray-400">Econ: {player.bowlingStats.economy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top All-Rounders */}
        <div className="brutalist-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">⭐</div>
            <h2 className="text-2xl font-display gradient-text">TOP ALL-ROUNDERS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaderboard?.topAllRounders.slice(0, 6).map((player, index) => (
              <div key={player._id} className="p-4 bg-dark border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xl font-bold text-primary">{index + 1}</div>
                  <div>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-xs text-gray-400">{player.team?.name}</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">Runs: <span className="text-white font-bold">{player.runs}</span></span>
                  <span className="text-gray-400">Wkts: <span className="text-white font-bold">{player.wickets}</span></span>
                </div>
                <div className="text-xs text-primary mt-1">Score: {player.allRounderScore}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
