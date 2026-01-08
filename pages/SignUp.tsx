
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { signUp } from '../services/supabase';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const { error: signUpError } = await signUp(email, password);

        if (signUpError) {
            setError(signUpError.message);
        } else {
            setSuccess('Account created! Please check your email to confirm your account.');
            setTimeout(() => navigate('/login'), 3000);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-md w-full bg-white border border-[#d4af37]/30 p-10 rounded-2xl shadow-xl relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
                        <UserPlus size={32} className="text-[#D4AF37]" />
                    </div>
                    <h1 className="text-2xl font-luxury font-bold text-gray-900 tracking-tight">Create Access.</h1>
                    <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mt-2">Daikin CMS Authorized Staff</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="admin@daikin.com" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Passkey</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="••••••••" required />
                        </div>
                    </div>

                    {error && <div className="p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-2 border border-red-100"><AlertCircle size={14} /> {error}</div>}
                    {success && <div className="p-4 bg-green-50 text-green-700 text-xs rounded-xl border border-green-100 text-center">{success}</div>}

                    <button type="submit" disabled={loading} className="w-full py-4 gold-gradient rounded-xl text-white font-bold text-xs tracking-widest shadow-lg hover:brightness-110 transition-all uppercase">
                        {loading ? 'Processing...' : 'Register Staff'}
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <Link to="/login" className="text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-widest">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
