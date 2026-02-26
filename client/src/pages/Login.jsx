import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center dots-background px-3 sm:px-4 py-12 md:py-20">
      <div className="w-full max-w-md">
        <div className="brutalist-border bg-dark p-5 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-display text-center mb-1 md:mb-2 gradient-text">
            ADMIN LOGIN
          </h1>
          <p className="text-center text-gray-400 mb-6 md:mb-8 uppercase text-xs sm:text-sm">
            Admin Access Only
          </p>

          {error && (
            <div className="bg-red-500/20 border-2 border-red-500 p-3 mb-6 text-red-500 text-xs sm:text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-dark-light border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none text-base"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-dark-light border-2 border-primary/30 px-4 py-3 text-white focus:border-primary outline-none text-base"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full brutalist-btn-primary"
            >
              {loading ? 'LOADING...' : '→ LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
