import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Badge, Spinner, EmptyState, Alert, Textarea } from '../components/ui';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [bmRes, surahRes] = await Promise.all([
        axios.get('/api/bookmarks'),
        axios.get('/api/surahs')
      ]);
      setBookmarks(Array.isArray(bmRes.data) ? bmRes.data : []);
      setSurahs(Array.isArray(surahRes.data) ? surahRes.data : []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load your bookmarks. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getSurah = (num) => surahs.find((s) => s.number === num);

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      setActionError('');
      await axios.delete(`/api/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {
      setActionError(e.response?.data?.error || 'Could not remove this bookmark. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const startEdit = (bm) => {
    setEditingId(bm._id);
    setNoteDraft(bm.note || '');
    setActionError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNoteDraft('');
  };

  const saveNote = async (id) => {
    try {
      setSavingNote(true);
      setActionError('');
      const res = await axios.put(`/api/bookmarks/${id}`, { note: noteDraft });
      setBookmarks((prev) => prev.map((b) => (b._id === id ? { ...b, note: res.data?.note ?? noteDraft } : b)));
      setEditingId(null);
      setNoteDraft('');
    } catch (e) {
      setActionError(e.response?.data?.error || 'Could not save your note. Please try again.');
    } finally {
      setSavingNote(false);
    }
  };

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return db - da;
  });

  return (
    <div>
      {/* Compact Page Hero */}
      <section className="hero" style={{ minHeight: '38vh', paddingTop: '64px', paddingBottom: '48px' }}>
        <img className="hero-bg" src="https://picsum.photos/seed/bookmarks-hero/1600/900" alt="" />
        <div className="container">
          <span className="eyebrow">Saved Ayahs</span>
          <h1>Verses you chose to <span className="gradient-text">keep</span>.</h1>
          <p className="hero-subtitle">Every ayah you bookmark lives here — with your notes, ready to revisit whenever your heart calls you back to it.</p>
        </div>
      </section>

      {/* Section 1: Bookmark List */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="section-label">Your Collection</span>
            <h2>Linger here, a verse at a time.</h2>
            <p>These are the ayahs you've marked for reflection, memorization, or simply because they moved you. Add a note, or return straight to the Mushaf.</p>
          </div>

          {error && (
            <Alert variant="error" title="Something went wrong">
              {error}
            </Alert>
          )}
          {actionError && (
            <Alert variant="error" title="Action failed">
              {actionError}
            </Alert>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '64px 0' }}>
              <Spinner size="lg" color="primary" />
              <p style={{ color: 'var(--muted)' }}>Gathering your saved verses…</p>
            </div>
          ) : sortedBookmarks.length === 0 ? (
            <EmptyState
              icon="🔖"
              title="No bookmarks yet"
              description="When you're reading the Quran, tap the bookmark icon on any ayah to save it here for later reflection."
              action={
                <Link to="/surahs" className="btn-primary">Begin Reading</Link>
              }
            />
          ) : (
            <div className="grid grid-2">
              {sortedBookmarks.map((bm, idx) => {
                const surah = getSurah(bm.surahNumber);
                const dateLabel = bm.createdAt
                  ? new Date(bm.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                  : '';
                return (
                  <Card
                    key={bm._id || idx}
                    variant="bordered"
                    padding="lg"
                    className={`animate-in-delay-${(idx % 4) + 1}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: '1px solid var(--accent)',
                          background: 'var(--surface-2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          flexShrink: 0
                        }}>
                          {bm.surahNumber ?? '?'}
                        </div>
                        <div>
                          <h3 style={{ margin: 0 }}>{surah?.nameEnglish || `Surah ${bm.surahNumber ?? ''}`}</h3>
                          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
                            Ayah {bm.ayahNumber ?? '—'}{dateLabel ? ` · Saved ${dateLabel}` : ''}
                          </p>
                        </div>
                      </div>
                      <Badge variant="primary" size="sm">{surah?.revelationType || 'Verse'}</Badge>
                    </div>

                    <div style={{
                      background: 'var(--surface-2)',
                      borderLeft: '3px solid var(--secondary)',
                      borderRadius: '0 10px 10px 0',
                      padding: '20px 24px',
                      marginBottom: '16px'
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                        lineHeight: 1.9,
                        textAlign: 'right',
                        direction: 'rtl',
                        color: 'var(--text)',
                        margin: 0
                      }}>
                        {surah?.nameArabic || ''}
                      </p>
                    </div>

                    {editingId === bm._id ? (
                      <div style={{ marginBottom: '16px' }}>
                        <Textarea
                          label="Your note"
                          placeholder="What did this ayah mean to you?"
                          rows={3}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          <Button size="sm" onClick={() => saveNote(bm._id)} loading={savingNote}>
                            {savingNote ? 'Saving…' : 'Save Note'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: '16px' }}>
                        {bm.note ? (
                          <p style={{ color: 'var(--text)', fontStyle: 'italic', margin: '0 0 8px 0' }}>
                            "{bm.note}"
                          </p>
                        ) : (
                          <p style={{ color: 'var(--muted)', margin: '0 0 8px 0' }}>No note added yet.</p>
                        )}
                        <button
                          onClick={() => startEdit(bm)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '0.9rem'
                          }}
                        >
                          {bm.note ? 'Edit note' : 'Add a note'}
                        </button>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                      <Link to={`/surah/${bm.surahNumber}`} style={{ flex: 1 }}>
                        <Button variant="secondary" size="sm" fullWidth>Return to Ayah</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(bm._id)}
                        loading={removingId === bm._id}
                      >
                        {removingId === bm._id ? 'Removing…' : 'Remove'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Divider motif */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="var(--accent)" />
        </svg>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
      </div>

      {/* Section 2: Why bookmark */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="section-label">The Practice</span>
            <h2>Why we encourage bookmarking</h2>
            <p>A verse that stops you mid-breath deserves to be found again — not lost in the scroll of a long surah.</p>
          </div>
          <div className="grid grid-3">
            <div className="feature-card animate-in">
              <div className="feature-icon">🕯️</div>
              <h3>Return to reflection</h3>
              <p>Save ayahs that move you, and revisit them during quiet moments — after fajr, before sleep, or whenever stillness finds you.</p>
            </div>
            <div className="feature-card animate-in-delay-1">
              <div className="feature-icon">✍️</div>
              <h3>Attach your own words</h3>
              <p>Add a personal note to each bookmark — a reminder of what you understood, felt, or wish to ask your teacher.</p>
            </div>
            <div className="feature-card animate-in-delay-2">
              <div className="feature-icon">🔁</div>
              <h3>Build gentle repetition</h3>
              <p>Bookmarked ayahs often become the seeds of memorization. What you keep returning to, you begin to keep by heart.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-section animate-in">
            <h2>Haven't started bookmarking yet?</h2>
            <p>Open any surah, tap the bookmark icon beside an ayah, and it will appear here — waiting for you.</p>
            <div className="hero-actions">
              <Link to="/surahs" className="btn-primary">Browse Surahs</Link>
              <Link to="/learn" className="btn-secondary">Explore Learning Paths</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}