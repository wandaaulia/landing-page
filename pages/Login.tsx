
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { signIn } from '../services/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message || 'Invalid credentials for Elite Access');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative bg-white border border-[#d4af37]/30 p-10 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-luxury font-bold text-gray-900 tracking-widest text-center">DAIKIN</h1>
            <p className="text-[#d4af37] text-xs font-medium tracking-[0.3em] uppercase mt-2">Proshop Elite Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#d4af37] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-transparent text-gray-900 transition-all placeholder:text-gray-400"
                  placeholder="admin@daikin.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#d4af37] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-transparent text-gray-900 transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

            <div className="flex items-center justify-between text-xs">
              <Link to="/signup" className="text-[#d4af37] hover:underline font-semibold">
                Create Account
              </Link>
              <Link to="/forgot-password" className="text-gray-500 hover:text-[#d4af37] font-semibold">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gold-gradient rounded-xl text-white font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "GRANT ACCESS"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-gray-400 tracking-wider">
            &copy; {new Date().getFullYear()} DAIKIN PROSHOP INDONESIA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
