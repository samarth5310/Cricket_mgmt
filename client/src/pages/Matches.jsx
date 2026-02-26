import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMatches();
  }, [filter]);

  const fetchMatches = async () => {
    try {
      const url = filter === 'all' ? '/matches' : `/matches?status=${filter}`;
      const { data } = await API.get(url);
      setMatches(data.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
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

  const getStatusBadge = (status) => {
    const badges = {
      live: 'bg-red-600 animate-pulse',
      completed: 'bg-green-600',
      scheduled: 'bg-blue-600',
      abandoned: 'bg-gray-600'
    };
    return badges[status] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-display text-center mb-12 gradient-text">
          MATCHES
        </h1>

        {/* Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {['all', 'live', 'completed', 'scheduled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 font-bold uppercase border-2 transition ${
                filter === status
                  ? 'bg-primary border-primary text-dark'
                  : 'bg-transparent border-primary text-primary hover:bg-primary hover:text-dark'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {matches.map((match) => (
            <Link
              key={match._id}
              to={`/match/${match._id}`}
              className="brutalist-card hover:border-primary transition block"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-400 uppercase">Match {match.matchNumber}</span>
                  <div className="text-sm text-gray-400">{match.venue}</div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase ${getStatusBadge(match.status)}`}>
                  {match.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Team 1 */}
                <div className="text-center md:text-right">
                  <div className="text-2xl font-display mb-2">{match.team1.shortName}</div>
                  <div className="text-sm text-gray-400">{match.team1.name}</div>
                  {match.innings[0] && (
                    <div className="text-xl font-bold text-primary mt-2">
                      {match.innings[0].runs}/{match.innings[0].wickets} ({match.innings[0].overs.toFixed(1)})
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">VS</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Team 2 */}
                <div className="text-center md:text-left">
                  <div className="text-2xl font-display mb-2">{match.team2.shortName}</div>
                  <div className="text-sm text-gray-400">{match.team2.name}</div>
                  {match.innings[1] && (
                    <div className="text-xl font-bold text-primary mt-2">
                      {match.innings[1].runs}/{match.innings[1].wickets} ({match.innings[1].overs.toFixed(1)})
                    </div>
                  )}
                </div>
              </div>

              {/* Result */}
              {match.status === 'completed' && match.result && (
                <div className="mt-4 pt-4 border-t-2 border-primary/20 text-center">
                  {match.result.isTie ? (
                    <p className="font-bold text-secondary">MATCH TIED</p>
                  ) : (
                    <p className="font-bold text-primary">
                      {match.result.winner?.name} won by {match.result.winMargin}
                    </p>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="brutalist-card text-center py-12">
            <p className="text-xl text-gray-400">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
