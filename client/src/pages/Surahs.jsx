import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Alert, Badge } from '../components/ui';

export default function Surahs() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get('/api/surahs');
        if (!cancelled) setSurahs(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.error || 'Failed to load surahs. Please check your connection.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (surahs || []).filter((s) => {
      const matchesFilter = filter === 'All' || (s.revelationType || '').toLowerCase() === filter.toLowerCase();
      const matchesSearch =
        term === '' ||
        (s.nameEnglish || '').toLowerCase().includes(term) ||
        (s.nameArabic || '').includes(term) ||
        String(s.number ?? '').includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [surahs, search, filter]);

  const fallbackSurahs = FALLBACK_SURAHS;
  const displayList = surahs.length === 0 && !loading && !error ? fallbackSurahs.filter((s) => {
    const term = search.trim().toLowerCase();
    const matchesFilter = filter === 'All' || s.revelationType === filter;
    const matchesSearch = term === '' || s.nameEnglish.toLowerCase().includes(term) || s.nameArabic.includes(term) || String(s.number).includes(term);
    return matchesFilter && matchesSearch;
  }) : filtered;

  return (
    <>
      <section className="hero" style={{ minHeight: '42vh' }}>
        <img className="hero-bg" src="https://picsum.photos/seed/surahlist1/1600/900" alt="" />
        <div className="container">
          <span className="eyebrow hero-eyebrow">The Noble Quran · 114 Surahs</span>
          <h1>Find your <span className="gradient-text">surah</span></h1>
          <p className="hero-subtitle">Search by name, number, or memory — then step into the reading canvas.</p>
        </div>
      </section>

      <div className="container">
        <section className="section animate-in">
          <div className="section-head">
            <span className="eyebrow">Browse</span>
            <h2>114 surahs. One search bar.</h2>
            <p>Filter by revelation type or search instantly — the Mushaf is never more than a keystroke away.</p>
          </div>

          <div className="surah-search-bar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="var(--muted)" strokeWidth="1.8" />
              <path d="M21 21L16.65 16.65" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by surah name, Arabic, or number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search surahs"
            />
          </div>

          <div className="filter-bar">
            {['All', 'Meccan', 'Medinan'].map((f) => (
              <button
                key={f}
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          {error && (
            <Alert variant="error" title="Could not load surahs">
              {error} — showing a preview list instead.
            </Alert>
          )}

          {loading ? (
            <div className="grid grid-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div className="card skeleton-card" key={i} style={{ minHeight: 160 }}>
                  <div className="skeleton-line" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <div className="skeleton-line" style={{ width: '60%', height: 18, marginTop: 16 }} />
                  <div className="skeleton-line" style={{ width: '40%', height: 14, marginTop: 10 }} />
                </div>
              ))}
            </div>
          ) : displayList.length === 0 ? (
            <div className="empty-state-wrap">
              <p className="section-head" style={{ margin: '0 auto' }}>No surahs match your search. Try a different name or number.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {displayList.map((s) => (
                <Link to={`/surah/${s.number}`} key={s.number} className="card surah-card animate-in">
                  <div className="surah-card-top">
                    <span className="surah-numeral-badge">{s.number}</span>
                    <Badge variant={s.revelationType === 'Meccan' ? 'warning' : 'success'} size="sm">
                      {s.revelationType || '—'}
                    </Badge>
                  </div>
                  <h3 className="surah-arabic-name">{s.nameArabic}</h3>
                  <h3 className="surah-eng-name">{s.nameEnglish}</h3>
                  <p className="surah-meta">{s.ayahCount ?? '—'} ayahs</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="divider-ornament">
            <span className="divider-line" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.8 8.2L20 6L15.8 11L20 16L13.8 13.8L12 20L10.2 13.8L4 16L8.2 11L4 6L10.2 8.2L12 2Z" fill="var(--accent)" />
            </svg>
            <span className="divider-line" />
          </div>
          <div className="section-head">
            <span className="eyebrow">A gentler way to read</span>
            <h2>Not sure where to begin?</h2>
            <p>New readers often start with Al-Fatiha, Yaseen, or Al-Mulk — short, luminous surahs recited daily by millions.</p>
          </div>
          <div className="grid grid-3">
            {['Al-Fatiha', 'Yaseen', 'Al-Mulk'].map((name, i) => {
              const match = fallbackSurahs.find((s) => s.nameEnglish === name);
              return (
                <Link to={match ? `/surah/${match.number}` : '/surahs'} key={name} className="card feature-card">
                  <div className="feature-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 19.5V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2.5Z" stroke="var(--primary)" strokeWidth="1.6" />
                      <path d="M8 7h8M8 10h8" stroke="var(--primary)" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3>{name}</h3>
                  <p>{match ? `${match.ayahCount} ayahs · ${match.revelationType}` : 'A gentle beginning for new readers.'}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

const FALLBACK_SURAHS = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatiha', ayahCount: 7, revelationType: 'Meccan' },
  { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', ayahCount: 286, revelationType: 'Medinan' },
  { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Aal-Imran', ayahCount: 200, revelationType: 'Medinan' },
  { number: 18, nameArabic: 'الكهف', nameEnglish: 'Al-Kahf', ayahCount: 110, revelationType: 'Meccan' },
  { number: 19, nameArabic: 'مريم', nameEnglish: 'Maryam', ayahCount: 98, revelationType: 'Meccan' },
  { number: 36, nameArabic: 'يس', nameEnglish: 'Yaseen', ayahCount: 83, revelationType: 'Meccan' },
  { number: 55, nameArabic: 'الرحمن', nameEnglish: 'Ar-Rahman', ayahCount: 78, revelationType: 'Medinan' },
  { number: 67, nameArabic: 'الملك', nameEnglish: 'Al-Mulk', ayahCount: 30, revelationType: 'Meccan' },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', ayahCount: 4, revelationType: 'Meccan' },
];