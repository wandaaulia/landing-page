
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { updatePassword } from '../services/supabase';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: updateError } = await updatePassword(password);

        if (updateError) {
            setError(updateError.message);
        } else {
            navigate('/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-md w-full bg-white border border-[#d4af37]/30 p-10 rounded-2xl shadow-xl relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
                        <RefreshCw size={32} className="text-[#D4AF37]" />
                    </div>
                    <h1 className="text-2xl font-luxury font-bold text-gray-900 tracking-tight">New Passkey.</h1>
                    <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mt-2">Update Credentials</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Passkey</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="••••••••" required />
                        </div>
                    </div>
                    {error && <div className="p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-2 border border-red-100"><AlertCircle size={14} /> {error}</div>}
                    <button type="submit" disabled={loading} className="w-full py-4 gold-gradient rounded-xl text-white font-bold text-xs tracking-widest shadow-lg hover:brightness-110 transition-all uppercase">
                        {loading ? 'Updating...' : 'Set New Passkey'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
