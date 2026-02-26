import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="brutalist-border bg-dark p-5 sm:p-8 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display mb-3 md:mb-4 gradient-text">
            DASHBOARD OVERVIEW
          </h1>
          <p className="text-sm md:text-base text-gray-400 mb-2">Welcome back, <span className="text-primary font-bold">{user?.name}</span></p>
          <p className="text-xs md:text-sm uppercase text-gray-500">Role: {user?.role}</p>
        </div>

        {user?.role === 'admin' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <Link to="/admin/teams" className="brutalist-card hover:border-primary transition group">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-primary">MANAGE TEAMS</h3>
              <p className="text-xs sm:text-sm text-gray-400">Create and edit teams</p>
            </Link>
            <Link to="/admin/players" className="brutalist-card hover:border-primary transition group">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-primary">MANAGE PLAYERS</h3>
              <p className="text-xs sm:text-sm text-gray-400">Add and manage players</p>
            </Link>
            <Link to="/admin/matches" className="brutalist-card hover:border-primary transition group">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-primary">SCHEDULE MATCHES</h3>
              <p className="text-xs sm:text-sm text-gray-400">Create match fixtures</p>
            </Link>
            <Link to="/matches?status=live" className="brutalist-card hover:border-primary transition group">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-primary">LIVE SCORING</h3>
              <p className="text-xs sm:text-sm text-gray-400">Update match scores</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
