
import React, { useEffect, useState, createContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import AboutManagement from './pages/AboutManagement';
import PortfolioManagement from './pages/PortfolioManagement';
import ArticleManagement from './pages/ArticleManagement';
import TestimonialManagement from './pages/TestimonialManagement';
import FAQManagement from './pages/FAQManagement';
import AwardsManagement from './pages/AwardsManagement';

// Public Pages
import Home from './pages/Public/Home';
import ArticleList from './pages/Public/ArticleList';
import ArticleDetail from './pages/Public/ArticleDetail';
import AboutDetail from './pages/Public/AboutDetail';
import ProductList from './pages/Public/ProductList';
import ProductDetail from './pages/Public/ProductDetail';
import PortfolioList from './pages/Public/PortfolioList';
import PortfolioDetail from './pages/Public/PortfolioDetail';
import AwardsList from './pages/Public/AwardsList';
import Contact from './pages/Public/Contact';

import { onAuthStateChange } from './services/supabase';

type Language = 'ID' | 'EN';
interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
}
export const LanguageContext = createContext<LanguageContextType>({ lang: 'ID', setLang: () => {} });

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'ID');

  useEffect(() => {
    // Listen to auth state changes from Supabase
    const { data: authListener } = onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const updateLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: updateLang }}>
      <HashRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/about" element={<AboutDetail />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/portfolio" element={<PortfolioList />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="/awards" element={<AwardsList />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Pages */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignUp />} />
          <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected CMS Pages */}
          <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/about-cms" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><AboutManagement /></Layout></ProtectedRoute>} />
          <Route path="/products-cms" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><ProductManagement /></Layout></ProtectedRoute>} />
          <Route path="/portfolios" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><PortfolioManagement /></Layout></ProtectedRoute>} />
          <Route path="/articles-cms" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><ArticleManagement /></Layout></ProtectedRoute>} />
          <Route path="/testimonials-cms" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><TestimonialManagement /></Layout></ProtectedRoute>} />
          <Route path="/faq-cms" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><FAQManagement /></Layout></ProtectedRoute>} />
          <Route path="/awards-cms" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout><AwardsManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<Navigate to="/dashboard" />} />
        </Routes>
      </HashRouter>
    </LanguageContext.Provider>
  );
};

const ProtectedRoute = ({ isLoggedIn, children }: { isLoggedIn: boolean; children: React.ReactNode }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default App;
