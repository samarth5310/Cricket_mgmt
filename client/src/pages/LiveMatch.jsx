import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const LiveMatch = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveMatch();
    const interval = setInterval(fetchLiveMatch, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [id]);

  const fetchLiveMatch = async () => {
    try {
      const { data } = await API.get(`/matches/${id}/live`);
      setMatchData(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live match:', error);
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

  if (!matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-red-500">Match not found</div>
      </div>
    );
  }

  const { match, currentInnings, crr, rrr, target, runsNeeded, oversRemaining, lastSixBalls } = matchData;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Live Indicator */}
        {match.status === 'live' && (
          <div className="brutalist-border bg-red-600 p-4 mb-6 text-center live-indicator">
            <span className="text-2xl font-bold uppercase">🔴 LIVE</span>
          </div>
        )}

        {/* Match Header */}
        <div className="brutalist-card mb-6">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-400 uppercase mb-2">Match {match.matchNumber}</div>
            <div className="text-xl text-gray-400">{match.venue}</div>
            <div className="text-sm text-gray-500">{new Date(match.date).toLocaleDateString()}</div>
          </div>

          {/* Teams */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-display mb-2">{match.team1.shortName}</div>
              <div className="text-gray-400">{match.team1.name}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display mb-2">{match.team2.shortName}</div>
              <div className="text-gray-400">{match.team2.name}</div>
            </div>
          </div>
        </div>

        {/* Current Score */}
        {currentInnings && (
          <div className="brutalist-border bg-dark p-8 mb-6 text-center">
            <div className="text-6xl md:text-8xl font-display mb-4 gradient-text">
              {currentInnings.runs}/{currentInnings.wickets}
            </div>
            <div className="text-3xl mb-6">
              Overs: {currentInnings.overs.toFixed(1)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="brutalist-card">
                <div className="text-sm text-gray-400 uppercase mb-1">CRR</div>
                <div className="text-2xl font-bold text-primary">{crr}</div>
              </div>
              {target && (
                <>
                  <div className="brutalist-card">
                    <div className="text-sm text-gray-400 uppercase mb-1">Target</div>
                    <div className="text-2xl font-bold text-primary">{target}</div>
                  </div>
                  <div className="brutalist-card">
                    <div className="text-sm text-gray-400 uppercase mb-1">Need</div>
                    <div className="text-2xl font-bold text-primary">{runsNeeded}</div>
                  </div>
                  <div className="brutalist-card">
                    <div className="text-sm text-gray-400 uppercase mb-1">RRR</div>
                    <div className="text-2xl font-bold text-primary">{rrr}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Last 6 Balls */}
        {lastSixBalls.length > 0 && (
          <div className="brutalist-card mb-6">
            <h3 className="text-xl font-bold mb-4 uppercase">Last 6 Balls</h3>
            <div className="flex gap-2 flex-wrap">
              {lastSixBalls.map((ball, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center font-bold text-lg border-2
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

        {/* Innings Summary */}
        {match.innings.map((innings, index) => (
          <div key={index} className="brutalist-card mb-6">
            <h3 className="text-xl font-bold mb-4 uppercase">
              Innings {index + 1} - {innings.battingTeam.name}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400">Score</div>
                <div className="text-2xl font-bold text-primary">
                  {innings.runs}/{innings.wickets}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Overs</div>
                <div className="text-2xl font-bold">{innings.overs.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Extras</div>
                <div className="text-2xl font-bold">
                  {innings.extras.wides + innings.extras.noBalls + innings.extras.byes + innings.extras.legByes}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Match Result */}
        {match.status === 'completed' && match.result && (
          <div className="brutalist-border bg-primary p-8 text-center text-dark">
            <h2 className="text-3xl font-display mb-4">MATCH RESULT</h2>
            {match.result.isTie ? (
              <p className="text-2xl font-bold">MATCH TIED</p>
            ) : (
              <>
                <p className="text-2xl font-bold mb-2">{match.result.winner?.name} Won</p>
                <p className="text-xl">by {match.result.winMargin}</p>
              </>
            )}
            {match.manOfTheMatch && (
              <div className="mt-6 p-4 bg-dark/20">
                <p className="text-sm uppercase mb-1">Man of the Match</p>
                <p className="text-xl font-bold">{match.manOfTheMatch.name}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatch;
