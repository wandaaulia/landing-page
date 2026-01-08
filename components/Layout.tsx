
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Briefcase,
  FileText,
  LogOut,
  ChevronRight,
  User,
  MessageSquare,
  HelpCircle,
  Award
} from 'lucide-react';
import { signOut, getCurrentUser } from '../services/supabase';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    async function loadUser() {
      const { user } = await getCurrentUser();
      if (user) {
        setUserEmail(user.email || '');
      }
    }
    loadUser();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Products', icon: <Package size={20} />, path: '/products-cms' },
    { name: 'Portfolios', icon: <Briefcase size={20} />, path: '/portfolios' },
    { name: 'Articles', icon: <FileText size={20} />, path: '/articles-cms' },
    { name: 'Awards', icon: <Award size={20} />, path: '/awards-cms' },
    { name: 'Testimonials', icon: <MessageSquare size={20} />, path: '/testimonials-cms' },
    { name: 'FAQs', icon: <HelpCircle size={20} />, path: '/faq-cms' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#d4af37]/20 flex flex-col">
        <div className="p-6 border-b border-[#d4af37]/20 flex items-center gap-3">
          <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
            <span className="text-[#0a0a0a] font-bold text-xl font-luxury">D</span>
          </div>
          <div>
            <h1 className="font-luxury text-sm font-bold gold-text tracking-widest">DAIKIN</h1>
            <p className="text-[10px] text-[#d4af37] font-medium tracking-tighter uppercase">Proshop Elite CMS</p>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#d4af37] text-[#0a0a0a] shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                    : 'text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
                {isActive && <ChevronRight className="ml-auto" size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#d4af37]/20">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-[#d4af37]/20 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-luxury font-bold tracking-wider capitalize">
            {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{userEmail || 'Administrator'}</p>
              <p className="text-[10px] text-[#d4af37]">Elite Access</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#d4af37]/50 flex items-center justify-center overflow-hidden bg-[#141414]">
              <User size={20} className="text-[#d4af37]" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
