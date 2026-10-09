import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Badge, Spinner, Alert, EmptyState } from '../components/ui';

export default function Reader() {
  const { number } = useParams();
  const navigate = useNavigate();

  const [surah, setSurah] = useState(null);
  const [allSurahs, setAllSurahs] = useState([]);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [viewMode, setViewMode] = useState('both'); // arabic-only | translation | both
  const [fontSize, setFontSize] = useState(2.25); // rem for arabic text
  const [nightMode, setNightMode] = useState(false);
  const [reciter, setReciter] = useState('Mishary Alafasy');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [bookmarkedSet, setBookmarkedSet] = useState({});
  const [noteDrafts, setNoteDrafts] = useState({});
  const [activeNoteAyah, setActiveNoteAyah] = useState(null);
  const [bookmarkMsg, setBookmarkMsg] = useState('');

  const surahNum = parseInt(number, 10) || 1;
  const userId = 'guest-visitor';

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [surahsRes, ayahsRes] = await Promise.all([
          axios.get('/api/surahs'),
          axios.get('/api/ayahs')
        ]);
        if (cancelled) return;
        const surahsList = Array.isArray(surahsRes.data) ? surahsRes.data : [];
        setAllSurahs(surahsList);
        const found = surahsList.find(s => s.number === surahNum);
        setSurah(found || null);

        const ayahsForSurah = (Array.isArray(ayahsRes.data) ? ayahsRes.data : [])
          .filter(a => a.surahNumber === surahNum)
          .sort((a, b) => (a.ayahNumber || 0) - (b.ayahNumber || 0));
        setAyahs(ayahsForSurah);

        try {
          const bmRes = await axios.get('/api/bookmarks');
          const bmMap = {};
          (Array.isArray(bmRes.data) ? bmRes.data : []).forEach(b => {
            if (b.userId === userId && b.surahNumber === surahNum) {
              bmMap[b.ayahNumber] = b;
            }
          });
          if (!cancelled) setBookmarkedSet(bmMap);
        } catch (e) {
          // bookmarks are non-critical, ignore silently but don't crash
        }
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.error || 'Failed to load the Mushaf. Please check your connection and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [surahNum]);

  const filteredNavSurahs = useMemo(() => allSurahs.slice().sort((a, b) => (a.number || 0) - (b.number || 0)), [allSurahs]);

  async function toggleBookmark(ayahNumber) {
    setBookmarkMsg('');
    try {
      if (bookmarkedSet[ayahNumber]) {
        const bm = bookmarkedSet[ayahNumber];
        if (bm._id) {
          await axios.delete(`/api/bookmarks/${bm._id}`);
        }
        setBookmarkedSet(prev => {
          const next = { ...prev };
          delete next[ayahNumber];
          return next;
        });
        setBookmarkMsg(`Removed Ayah ${ayahNumber} from your bookmarks.`);
      } else {
        const note = noteDrafts[ayahNumber] || '';
        const res = await axios.post('/api/bookmarks', {
          userId,
          surahNumber: surahNum,
          ayahNumber,
          note,
          createdAt: new Date().toISOString()
        });
        setBookmarkedSet(prev => ({ ...prev, [ayahNumber]: res.data }));
        setBookmarkMsg(`Saved Ayah ${ayahNumber} for later.`);
      }
    } catch (e) {
      setBookmarkMsg(e.response?.data?.error || 'Could not update bookmark. Please try again.');
    }
  }

  function copyAyah(ayah) {
    const text = `${ayah.textArabic || ''}\n\n${ayah.translationEnglish || ''} (Surah ${surahNum}:${ayah.ayahNumber})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setBookmarkMsg(`Copied Ayah ${ayah.ayahNumber} to clipboard.`);
      }).catch(() => {
        setBookmarkMsg('Could not copy to clipboard.');
      });
    }
  }

  function playAudio(ayah) {
    if (!ayah.audioUrl) {
      setPlayingAyah(ayah.ayahNumber);
      setTimeout(() => setPlayingAyah(null), 1500);
      return;
    }
    setPlayingAyah(ayah.ayahNumber);
  }

  const circleNumeral = surah?.number ?? surahNum;

  return (
    <div className="reader-page" style={{ background: nightMode ? '#14201c' : 'var(--bg)', minHeight: '100vh', transition: 'background 0.3s ease' }}>
      {/* Compact hero */}
      <section className="hero" style={{ paddingTop: '48px', paddingBottom: '32px', minHeight: 'unset' }}>
        <div className="container">
          <span className="eyebrow">Quran Reader</span>
          <h1 style={{ color: nightMode ? '#F4EFE0' : 'var(--text)' }}>
            The Mushaf, made for the screen — <span className="gradient-text">without losing its soul.</span>
          </h1>
          <p className="hero-subtitle">Tap any ayah to hear it, translate it, or save it for later.</p>
        </div>
      </section>

      <div className="container">
        <div className="reader-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start', paddingBottom: '48px' }}>

          {/* Sticky Surah Navigator */}
          <aside className="surah-navigator card" style={{ position: 'sticky', top: '96px', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto', padding: '24px' }}>
            <h3 style={{ marginBottom: '6px' }}>Surah Navigator</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>Find your surah — by name, by number, or by memory.</p>
            <ReaderNavList surahs={filteredNavSurahs} activeNumber={surahNum} navigate={navigate} />
            <div style={{ marginTop: '20px' }}>
              <Link to="/surahs"><Button variant="ghost" size="sm" fullWidth>Browse all Surahs</Button></Link>
            </div>
          </aside>

          {/* Reading Canvas */}
          <div className="reading-canvas">
            {/* Toolbar */}
            <div className="canvas-toolbar card" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="surah-circle-badge" style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  border: '1px solid var(--accent)', background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem'
                }}>
                  {circleNumeral}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{surah?.nameEnglish || 'Loading…'}</h2>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {surah?.nameArabic || ''} · {surah?.ayahCount ?? ayahs.length} ayahs · {surah?.revelationType || ''}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(s => !s)}>⚙ Settings</Button>
                {surahNum > 1 && (
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/surah/${surahNum - 1}`)}>← Prev</Button>
                )}
                {surahNum < 114 && (
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/surah/${surahNum + 1}`)}>Next →</Button>
                )}
              </div>
            </div>

            {/* Settings Drawer */}
            {settingsOpen && (
              <div className="card animate-in" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '4px' }}>Read it your way.</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Shape the page around your eyes, not the other way around.</p>
                <div className="grid grid-3" style={{ gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>View Mode</label>
                    <div className="filter-bar" style={{ flexWrap: 'wrap' }}>
                      {['arabic-only', 'translation', 'both'].map(mode => (
                        <button
                          key={mode}
                          className={viewMode === mode ? 'active' : ''}
                          onClick={() => setViewMode(mode)}
                          type="button"
                        >
                          {mode === 'arabic-only' ? 'Arabic only' : mode === 'translation' ? 'Translation' : 'Both'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Arabic Font Size</label>
                    <input
                      type="range"
                      min="1.5"
                      max="3"
                      step="0.125"
                      value={fontSize}
                      onChange={e => setFontSize(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Reciter</label>
                    <select value={reciter} onChange={e => setReciter(e.target.value)}>
                      <option>Mishary Alafasy</option>
                      <option>Abdul Basit</option>
                      <option>Saad Al-Ghamdi</option>
                      <option>Mahmoud Khalil Al-Husary</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="nightmode" checked={nightMode} onChange={e => setNightMode(e.target.checked)} />
                  <label htmlFor="nightmode" style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Night mode</label>
                </div>
              </div>
            )}

            {bookmarkMsg && (
              <Alert variant="info" dismissible>{bookmarkMsg}</Alert>
            )}

            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            {/* Bismillah ornament */}
            {!loading && !error && ayahs.length > 0 && surahNum !== 9 && (
              <div style={{ textAlign: 'center', margin: '8px 0 32px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,2.6vw,2.1rem)', color: 'var(--primary)' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card" style={{ padding: '32px', marginBottom: '20px' }}>
                    <div style={{ height: '18px', width: '40%', background: 'var(--surface-2)', borderRadius: '6px', marginBottom: '20px' }} />
                    <div style={{ height: '36px', width: '90%', background: 'var(--surface-2)', borderRadius: '6px', margin: '0 auto 16px' }} />
                    <div style={{ height: '16px', width: '70%', background: 'var(--surface-2)', borderRadius: '6px', margin: '0 auto' }} />
                  </div>
                ))}
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spinner size="lg" color="primary" />
                </div>
              </div>
            )}

            {!loading && !error && ayahs.length === 0 && (
              <EmptyState
                icon="📖"
                title="No ayahs found"
                description="This surah hasn't been loaded into the Mushaf yet. Please choose another surah from the navigator."
                action={<Link to="/surahs"><Button>Browse Surahs</Button></Link>}
              />
            )}

            {/* Verse blocks */}
            {!loading && !error && ayahs.map(ayah => {
              const isBookmarked = !!bookmarkedSet[ayah.ayahNumber];
              const isPlaying = playingAyah === ayah.ayahNumber;
              return (
                <div
                  key={ayah.ayahNumber}
                  className="verse-block animate-in"
                  style={{
                    background: nightMode ? '#1d2a25' : 'var(--surface-2)',
                    borderLeft: '3px solid var(--secondary)',
                    borderRadius: '0 14px 14px 0',
                    padding: '32px',
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge badge-primary">Ayah {ayah.ayahNumber}</span>
                    {isBookmarked && <Badge variant="success" size="sm">★ Bookmarked</Badge>}
                  </div>

                  {(viewMode === 'arabic-only' || viewMode === 'both') && (
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: `${fontSize}rem`,
                      lineHeight: 2.1,
                      textAlign: 'center',
                      color: nightMode ? '#F4EFE0' : 'var(--text)',
                      direction: 'rtl',
                      marginBottom: viewMode === 'both' ? '20px' : 0
                    }}>
                      {ayah.textArabic || '—'}
                    </p>
                  )}

                  {(viewMode === 'translation' || viewMode === 'both') && (
                    <div style={{ borderTop: viewMode === 'both' ? '1px solid var(--border)' : 'none', paddingTop: viewMode === 'both' ? '16px' : 0 }}>
                      {ayah.transliteration && (
                        <p style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '8px', fontSize: '0.95rem' }}>
                          {ayah.transliteration}
                        </p>
                      )}
                      <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                        {ayah.translationEnglish || 'Translation unavailable.'}
                      </p>
                    </div>
                  )}

                  {/* Verse toolbar */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                    <Button variant={isPlaying ? 'primary' : 'ghost'} size="sm" onClick={() => playAudio(ayah)}>
                      {isPlaying ? '🔊 Playing…' : '▶ Play'}
                    </Button>
                    <Button variant={isBookmarked ? 'primary' : 'ghost'} size="sm" onClick={() => toggleBookmark(ayah.ayahNumber)}>
                      {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyAyah(ayah)}>⧉ Copy</Button>
                    <Button variant="ghost" size="sm" onClick={() => setActiveNoteAyah(activeNoteAyah === ayah.ayahNumber ? null : ayah.ayahNumber)}>
                      ✎ Note
                    </Button>
                    <Link to="/bookmarks"><Button variant="ghost" size="sm">Tafsir &amp; Saved</Button></Link>
                  </div>

                  {activeNoteAyah === ayah.ayahNumber && (
                    <div style={{ marginTop: '16px' }}>
                      <textarea
                        placeholder="Add a private note for this ayah…"
                        value={noteDrafts[ayah.ayahNumber] || ''}
                        onChange={e => setNoteDrafts(prev => ({ ...prev, [ayah.ayahNumber]: e.target.value }))}
                        rows={3}
                        style={{ width: '100%' }}
                      />
                      <div style={{ marginTop: '8px' }}>
                        <Button size="sm" onClick={() => toggleBookmark(ayah.ayahNumber)}>
                          {isBookmarked ? 'Update Bookmark Note' : 'Save with Note'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {ayah.audioUrl && isPlaying && (
                    <audio
                      src={ayah.audioUrl}
                      autoPlay
                      onEnded={() => setPlayingAyah(null)}
                      style={{ display: 'none' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Continue Reading Footer */}
      {!loading && surah && (
        <div style={{
          position: 'sticky', bottom: 0, left: 0, right: 0,
          background: 'var(--primary)', color: '#fff',
          padding: '16px 0', boxShadow: '0 -10px 24px -10px rgba(14,107,92,.4)', zIndex: 10
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ color: '#fff', fontSize: '0.95rem' }}>
              Surah {surah.nameEnglish || surahNum}, continue reading where you left off.
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReaderNavList({ surahs, activeNumber, navigate }) {
  const [query, setQuery] = useState('');
  const [juzFilter, setJuzFilter] = useState('all');

  const filtered = (surahs || []).filter(s => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.nameEnglish || '').toLowerCase().includes(q) ||
      (s.nameArabic || '').includes(q) ||
      String(s.number || '').includes(q)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search surah by name or number…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', marginBottom: '14px' }}
      />
      <div className="nav-surah-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filtered.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No surahs match your search.</p>
        )}
        {filtered.map(s => (
          <button
            key={s.number}
            onClick={() => navigate(`/surah/${s.number}`)}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              background: s.number === activeNumber ? 'var(--surface-2)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 180ms ease'
            }}
          >
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '1px solid var(--accent)', background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0
            }}>
              {s.number}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowwrap' }}>
              {s.nameEnglish || 'Untitled'}
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-display)' }}>
              {s.nameArabic || ''}
            </span>
          </span>
          </button>
        ))}
      </div>
    </div>
  );
}