
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldQuestion, ArrowLeft } from 'lucide-react';
import { resetPasswordEmail } from '../services/supabase';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: resetError } = await resetPasswordEmail(email);

        if (resetError) {
            setError(resetError.message);
        } else {
            setMessage('Recovery instructions sent to your email.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-md w-full bg-white border border-[#d4af37]/30 p-10 rounded-2xl shadow-xl relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldQuestion size={32} className="text-[#D4AF37]" />
                    </div>
                    <h1 className="text-2xl font-luxury font-bold text-gray-900 tracking-tight">Recover Access.</h1>
                    <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mt-2">Daikin CMS Credential Recovery</p>
                </div>

                {message ? (
                    <div className="p-6 bg-green-50 text-green-700 text-sm rounded-2xl border border-green-100 text-center space-y-4">
                        <p>{message}</p>
                        <Link to="/login" className="block text-xs font-bold text-[#D4AF37] uppercase tracking-widest hover:underline">Return to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Authorized Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="admin@daikin.com" required />
                            </div>
                        </div>

                        {error && <div className="p-4 bg-red-50 text-red-500 text-xs rounded-xl border border-red-100 text-center">{error}</div>}

                        <button type="submit" disabled={loading} className="w-full py-4 gold-gradient rounded-xl text-white font-bold text-xs tracking-widest shadow-lg hover:brightness-110 transition-all uppercase">
                            {loading ? 'Sending...' : 'Send Recovery Link'}
                        </button>
                        <div className="text-center">
                            <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-[#D4AF37] uppercase tracking-widest transition-colors"><ArrowLeft size={14} /> Back to Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
