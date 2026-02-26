import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../utils/api';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [liveMatch, setLiveMatch] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchLiveMatch();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/stats/overview');
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLiveMatch = async () => {
    try {
      const { data } = await API.get('/matches?status=live');
      if (data.data.length > 0) {
        setLiveMatch(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching live match:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen md:h-screen flex items-center justify-center dots-background">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark"></div>
        <div className="container mx-auto px-4 text-center relative z-10 py-12 md:py-0">
          <div className="mb-2 md:mb-4 text-xs md:text-sm font-bold text-secondary uppercase tracking-wider">
            BGMIT PRESENTS
          </div>
          <div className="mb-2 text-xs md:text-sm text-gray-400 uppercase tracking-widest">
            // compete • excel • conquer
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display mb-4 md:mb-6">
            <span className="text-white">SPORTS</span>
            <span className="text-primary">'26</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl font-bold uppercase tracking-wider mb-4 md:mb-8 text-secondary">
            PLAY • COMPETE • WIN
          </p>
          <p className="text-xs sm:text-sm text-gray-300 mb-2 uppercase tracking-wide">
            ANNUAL INTER-BRANCH SPORTS • MUDHOL • MARCH 2026
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto">
            Join 500+ athletes for an unforgettable experience of competing,
            learning, and excelling at BGMIT's premier sports championship.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-2 sm:px-0">
            <Link to="/matches" className="brutalist-btn-primary text-xs sm:text-sm">
              → VIEW MATCHES
            </Link>
            <Link to="/points-table" className="brutalist-btn-secondary text-xs sm:text-sm">
              POINTS TABLE
            </Link>
          </div>
        </div>
      </section>

      {/* Live Match Banner */}
      {liveMatch && (
        <section className="bg-primary py-3 md:py-4">
          <div className="container mx-auto px-4">
            <Link to={`/match/${liveMatch._id}`} className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-dark">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse flex-shrink-0"></span>
              <span className="font-bold text-sm sm:text-base md:text-lg uppercase text-center">
                LIVE: {liveMatch.team1.shortName} vs {liveMatch.team2.shortName}
              </span>
              <span className="font-bold text-xs sm:text-base hidden sm:inline">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {stats && (
        <section className="py-12 md:py-20 bg-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-center mb-8 md:mb-16 gradient-text">
              TOURNAMENT STATS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="brutalist-card text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-display text-primary mb-2">{stats.totalMatches}</div>
                <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-400">Total Events</div>
              </div>
              <div className="brutalist-card text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-display text-primary mb-2">{stats.totalTeams}</div>
                <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-400">Teams</div>
              </div>
              <div className="brutalist-card text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-display text-primary mb-2">{stats.totalRuns}</div>
                <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-400">Total Runs</div>
              </div>
              <div className="brutalist-card text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-display text-primary mb-2">{stats.totalWickets}</div>
                <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-400">Total Wickets</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-12 md:py-20 bg-dark-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-center mb-8 md:mb-16 gradient-text">
            EXPLORE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <Link to="/leaderboard" className="brutalist-card hover:border-primary transition group">
              <div className="text-4xl md:text-6xl mb-4">🏆</div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 group-hover:text-primary transition">LEADERBOARD</h3>
              <p className="text-sm md:text-base text-gray-400">Top performers, stats, and awards</p>
            </Link>
            <Link to="/teams" className="brutalist-card hover:border-primary transition group">
              <div className="text-4xl md:text-6xl mb-4">👥</div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 group-hover:text-primary transition">TEAMS</h3>
              <p className="text-sm md:text-base text-gray-400">View all participating teams</p>
            </Link>
            <Link to="/players" className="brutalist-card hover:border-primary transition group">
              <div className="text-4xl md:text-6xl mb-4">🏏</div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 group-hover:text-primary transition">PLAYERS</h3>
              <p className="text-sm md:text-base text-gray-400">Player profiles and statistics</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
