import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-dark border-b-4 border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="text-2xl md:text-3xl font-display">
              <span className="text-white">SPORTS</span>
              <span className="text-primary">'26</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/matches" className="text-white hover:text-primary font-bold uppercase text-sm transition">
              Matches
            </Link>
            <Link to="/points-table" className="text-white hover:text-primary font-bold uppercase text-sm transition">
              Points
            </Link>
            <Link to="/teams" className="text-white hover:text-primary font-bold uppercase text-sm transition">
              Teams
            </Link>
            <Link to="/players" className="text-white hover:text-primary font-bold uppercase text-sm transition">
              Players
            </Link>
            <Link to="/leaderboard" className="text-white hover:text-primary font-bold uppercase text-sm transition">
              Leaderboard
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="brutalist-btn-secondary text-xs md:text-sm">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="brutalist-btn-primary text-xs md:text-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="brutalist-btn-primary text-xs md:text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:text-primary transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-4 pb-4 border-t border-primary/30 pt-4">
            <Link
              to="/matches"
              className="text-white hover:text-primary font-bold uppercase text-sm p-3 hover:bg-dark-light transition rounded"
              onClick={closeMobileMenu}
            >
              Matches
            </Link>
            <Link
              to="/points-table"
              className="text-white hover:text-primary font-bold uppercase text-sm p-3 hover:bg-dark-light transition rounded"
              onClick={closeMobileMenu}
            >
              Points Table
            </Link>
            <Link
              to="/teams"
              className="text-white hover:text-primary font-bold uppercase text-sm p-3 hover:bg-dark-light transition rounded"
              onClick={closeMobileMenu}
            >
              Teams
            </Link>
            <Link
              to="/players"
              className="text-white hover:text-primary font-bold uppercase text-sm p-3 hover:bg-dark-light transition rounded"
              onClick={closeMobileMenu}
            >
              Players
            </Link>
            <Link
              to="/leaderboard"
              className="text-white hover:text-primary font-bold uppercase text-sm p-3 hover:bg-dark-light transition rounded"
              onClick={closeMobileMenu}
            >
              Leaderboard
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="brutalist-btn-secondary text-xs w-full text-center"
                    onClick={closeMobileMenu}
                  >
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="brutalist-btn-primary text-xs w-full">
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="brutalist-btn-primary text-xs w-full text-center"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
