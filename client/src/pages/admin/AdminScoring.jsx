import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const AdminScoring = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [ballData, setBallData] = useState({
    batsman: '',
    bowler: '',
    runs: 0,
    isWicket: false,
    wicketType: '',
    isWide: false,
    isNoBall: false,
    isBye: false,
    isLegBye: false
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMatchData();
    const interval = setInterval(fetchMatchData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchMatchData = async () => {
    try {
      const { data } = await API.get(`/matches/${id}/live`);
      setMatchData(data.data);
      
      // Fetch players for current teams
      if (data.data.match) {
        const team1Players = await API.get(`/players?team=${data.data.match.team1._id}`);
        const team2Players = await API.get(`/players?team=${data.data.match.team2._id}`);
        setPlayers([...team1Players.data.data, ...team2Players.data.data]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching match data:', error);
      setLoading(false);
    }
  };

  const handleBallSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await API.post(`/matches/${id}/ball`, ballData);
      // Reset form
      setBallData({
        ...ballData,
        runs: 0,
        isWicket: false,
        wicketType: '',
        isWide: false,
        isNoBall: false,
        isBye: false,
        isLegBye: false
      });
      fetchMatchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding ball');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteMatch = async () => {
    const manOfTheMatch = prompt('Enter Man of the Match player ID:');
    if (!manOfTheMatch) return;

    if (!confirm('Are you sure you want to complete this match?')) return;

    try {
      await API.put(`/matches/${id}/complete`, { manOfTheMatch });
      alert('Match completed successfully!');
      navigate('/admin/matches');
    } catch (error) {
      alert(error.response?.data?.message || 'Error completing match');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-red-500">Match not found</div>
      </div>
    );
  }

  const { match, currentInnings, crr, rrr, target, runsNeeded, lastSixBalls } = matchData;
  const currentBattingTeamPlayers = players.filter(p => 
    p.team._id === currentInnings?.battingTeam.toString()
  );
  const currentBowlingTeamPlayers = players.filter(p => 
    p.team._id === currentInnings?.bowlingTeam.toString()
  );

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-5xl font-display gradient-text">LIVE SCORING</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/matches')}
              className="brutalist-btn-secondary text-sm"
            >
              ← BACK
            </button>
            {currentInnings && currentInnings.overs >= match.totalOvers && (
              <button
                onClick={handleCompleteMatch}
                className="brutalist-btn-primary text-sm bg-green-600 border-green-600"
              >
                COMPLETE MATCH
              </button>
            )}
          </div>
        </div>

        {/* Live Indicator */}
        <div className="brutalist-border bg-red-600 p-4 mb-6 text-center live-indicator">
          <span className="text-2xl font-bold uppercase">🔴 MATCH LIVE</span>
        </div>

        {/* Match Info */}
        <div className="brutalist-card mb-6">
          <div className="text-center mb-4">
            <div className="text-xl font-bold">
              {match.team1.shortName} vs {match.team2.shortName}
            </div>
            <div className="text-sm text-gray-400">{match.venue} • Match {match.matchNumber}</div>
          </div>

          {/* Current Score */}
          {currentInnings && (
            <div className="text-center">
              <div className="text-6xl font-display gradient-text mb-4">
                {currentInnings.runs}/{currentInnings.wickets}
              </div>
              <div className="text-2xl mb-6">
                Overs: {currentInnings.overs.toFixed(1)} / {match.totalOvers}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-dark border-2 border-primary/30">
                  <div className="text-xs text-gray-400 uppercase">CRR</div>
                  <div className="text-xl font-bold text-primary">{crr}</div>
                </div>
                {target && (
                  <>
                    <div className="p-3 bg-dark border-2 border-primary/30">
                      <div className="text-xs text-gray-400 uppercase">Target</div>
                      <div className="text-xl font-bold text-primary">{target}</div>
                    </div>
                    <div className="p-3 bg-dark border-2 border-primary/30">
                      <div className="text-xs text-gray-400 uppercase">Need</div>
                      <div className="text-xl font-bold text-primary">{runsNeeded}</div>
                    </div>
                    <div className="p-3 bg-dark border-2 border-primary/30">
                      <div className="text-xs text-gray-400 uppercase">RRR</div>
                      <div className="text-xl font-bold text-primary">{rrr}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Last 6 Balls */}
        {lastSixBalls && lastSixBalls.length > 0 && (
          <div className="brutalist-card mb-6">
            <h3 className="text-lg font-bold mb-4 uppercase">Last 6 Balls</h3>
            <div className="flex gap-2 flex-wrap">
              {lastSixBalls.map((ball, index) => (
                <div
                  key={index}
                  className={`w-14 h-14 flex items-center justify-center font-bold text-lg border-2
                    ${ball.isWicket ? 'bg-red-600 border-red-600 text-white' : 
                      ball.runs === 6 ? 'bg-purple-600 border-purple-600 text-white' :
                      ball.runs === 4 ? 'bg-blue-600 border-blue-600 text-white' :
                      'bg-dark border-primary/30 text-primary'}`}
                >
                  {ball.isWicket ? 'W' : ball.isWide ? 'WD' : ball.isNoBall ? 'NB' : ball.runs}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Form */}
        {currentInnings && currentInnings.overs < match.totalOvers && (
          <div className="brutalist-border bg-dark p-6">
            <h2 className="text-2xl font-bold mb-6 uppercase text-primary">Add Ball</h2>
            <form onSubmit={handleBallSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Batsman</label>
                  <select
                    value={ballData.batsman}
                    onChange={(e) => setBallData({ ...ballData, batsman: e.target.value })}
                    required
                    className="w-full bg-dark-light border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  >
                    <option value="">Select Batsman</option>
                    {currentBattingTeamPlayers.map((player) => (
                      <option key={player._id} value={player._id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Bowler</label>
                  <select
                    value={ballData.bowler}
                    onChange={(e) => setBallData({ ...ballData, bowler: e.target.value })}
                    required
                    className="w-full bg-dark-light border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  >
                    <option value="">Select Bowler</option>
                    {currentBowlingTeamPlayers.map((player) => (
                      <option key={player._id} value={player._id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Runs Buttons */}
              <div>
                <label className="block text-sm font-bold mb-3 uppercase">Runs</label>
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3, 4, 6].map((run) => (
                    <button
                      key={run}
                      type="button"
                      onClick={() => setBallData({ ...ballData, runs: run })}
                      className={`py-4 font-bold text-2xl border-2 transition ${
                        ballData.runs === run
                          ? 'bg-primary border-primary text-dark'
                          : 'bg-dark-light border-primary/30 text-white hover:border-primary'
                      }`}
                    >
                      {run}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extras and Wicket */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center p-4 bg-dark-light border-2 border-primary/30 cursor-pointer hover:border-primary transition">
                  <input
                    type="checkbox"
                    checked={ballData.isWide}
                    onChange={(e) => setBallData({ ...ballData, isWide: e.target.checked })}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold uppercase">Wide</span>
                </label>

                <label className="flex items-center p-4 bg-dark-light border-2 border-primary/30 cursor-pointer hover:border-primary transition">
                  <input
                    type="checkbox"
                    checked={ballData.isNoBall}
                    onChange={(e) => setBallData({ ...ballData, isNoBall: e.target.checked })}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold uppercase">No Ball</span>
                </label>

                <label className="flex items-center p-4 bg-dark-light border-2 border-primary/30 cursor-pointer hover:border-primary transition">
                  <input
                    type="checkbox"
                    checked={ballData.isBye}
                    onChange={(e) => setBallData({ ...ballData, isBye: e.target.checked })}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold uppercase">Bye</span>
                </label>

                <label className="flex items-center p-4 bg-dark-light border-2 border-primary/30 cursor-pointer hover:border-primary transition">
                  <input
                    type="checkbox"
                    checked={ballData.isLegBye}
                    onChange={(e) => setBallData({ ...ballData, isLegBye: e.target.checked })}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold uppercase">Leg Bye</span>
                </label>

                <label className="flex items-center p-4 bg-red-500/20 border-2 border-red-500 cursor-pointer hover:bg-red-500/30 transition">
                  <input
                    type="checkbox"
                    checked={ballData.isWicket}
                    onChange={(e) => setBallData({ ...ballData, isWicket: e.target.checked })}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-bold uppercase text-red-500">Wicket</span>
                </label>
              </div>

              {ballData.isWicket && (
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Wicket Type</label>
                  <select
                    value={ballData.wicketType}
                    onChange={(e) => setBallData({ ...ballData, wicketType: e.target.value })}
                    className="w-full bg-dark-light border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value="bowled">Bowled</option>
                    <option value="caught">Caught</option>
                    <option value="lbw">LBW</option>
                    <option value="run-out">Run Out</option>
                    <option value="stumped">Stumped</option>
                    <option value="hit-wicket">Hit Wicket</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full brutalist-btn-primary text-xl py-4"
              >
                {submitting ? 'ADDING...' : '→ ADD BALL'}
              </button>
            </form>
          </div>
        )}

        {/* Player IDs Reference */}
        <div className="brutalist-card mt-6 bg-dark-light">
          <h3 className="text-sm font-bold mb-3 text-gray-400 uppercase">Player IDs Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-primary mb-2">{currentInnings?.battingTeam.name}</h4>
              <div className="space-y-1 text-xs">
                {currentBattingTeamPlayers.map((player) => (
                  <div key={player._id} className="p-2 bg-dark border border-primary/20 flex justify-between">
                    <span>{player.name}</span>
                    <span className="font-mono text-primary">{player._id}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-2">{currentInnings?.bowlingTeam.name}</h4>
              <div className="space-y-1 text-xs">
                {currentBowlingTeamPlayers.map((player) => (
                  <div key={player._id} className="p-2 bg-dark border border-primary/20 flex justify-between">
                    <span>{player.name}</span>
                    <span className="font-mono text-primary">{player._id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScoring;
