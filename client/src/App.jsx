import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Surahs from './pages/Surahs';
import Reader from './pages/Reader';
import Bookmarks from './pages/Bookmarks';
import Learn from './pages/Learn';
import Admin from './pages/Admin.jsx'

export default function App() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for premium minimal transparent->solid header navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change for seamless page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Sticky Premium Nav Bar */}
      <header className={`nav-minimal ${scrolled ? 'scrolled' : ''}`} style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(252, 250, 244, 0.95)' : 'rgba(252, 250, 244, 0.82)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="nav-logo" style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--primary)" stroke="var(--accent)" strokeWidth="1"/>
            </svg>
            <span style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--primary)',
              letterSpacing: '0.05em'
            }}>
              islm
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active" : ""} 
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontWeight: '500',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                transition: 'color 0.2s ease',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              Home
            </NavLink>
            <NavLink 
              to="/surahs" 
              className={({ isActive }) => isActive ? "active" : ""} 
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontWeight: '500',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                transition: 'color 0.2s ease',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              Mushaf
            </NavLink>
            <NavLink 
              to="/learn" 
              className={({ isActive }) => isActive ? "active" : ""} 
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontWeight: '500',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                transition: 'color 0.2s ease',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              Learn & Hifz
            </NavLink>
            <NavLink 
              to="/bookmarks" 
              className={({ isActive }) => isActive ? "active" : ""} 
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontWeight: '500',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                transition: 'color 0.2s ease',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              Bookmarks
            </NavLink>
          </nav>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/surahs" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Open Mushaf
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surahs" element={<Surahs />} />
          <Route path="/surah/:number" element={<Reader />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/learn" element={<Learn />} />
                <Route path="/admin" element={<Admin />} />
      </Routes>
      </main>

      {/* Shared Premium Footer */}
      <footer className="footer" style={{ 
        background: 'var(--surface-2)', 
        borderTop: '1px solid var(--border)', 
        padding: '80px 0 40px 0', 
        marginTop: 'auto' 
      }}>
        <div className="container">
          <div className="footer-grid grid-4" style={{ marginBottom: '48px', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--primary)" stroke="var(--accent)" strokeWidth="1"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>islm</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Draw near to the Word. A serene, luminous sanctuary for reading, memorizing, and understanding the Noble Quran.
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '16px', fontSize: '1.15rem' }}>The Mushaf</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/surahs" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Browse Surahs</Link></li>
                <li><Link to="/surah/1" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Al-Fatihah</Link></li>
                <li><Link to="/surah/36" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Surah Ya-Sin</Link></li>
                <li><Link to="/surah/67" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Surah Al-Mulk</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '16px', fontSize: '1.15rem' }}>Learning Hub</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/learn" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Hifz Progress Tracker</Link></li>
                <li><Link to="/learn" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Tajweed Fundamentals</Link></li>
                <li><Link to="/learn" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Tafsir Course</Link></li>
                <li><Link to="/bookmarks" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem' }}>My Saved Ayahs</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '16px', fontSize: '1.15rem' }}>Platform</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '12px', lineHeight: '1.5' }}>
                Authentic Uthmani text. Checked and verified with reverent attention to detail.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-success" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Verified Text</span>
                <span className="badge badge-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Hafsn Recitation</span>
              </div>
            </div>
          </div>

          {/* Section Divider Motif */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }}></div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" style={{ margin: '0 16px', opacity: 0.8 }} xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
              &copy; {new Date().getFullYear()} Islm Quranic Platform. All rights reserved.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              Draw near to the Word.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}