import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, Select, Badge, Alert } from '../components/ui';

const PROGRESS_RINGS = [
  { label: 'Memorized', value: 3, total: 30, color: 'var(--primary)' },
  { label: 'In Progress', value: 2, total: 30, color: 'var(--secondary)' },
  { label: 'Due for Revision', value: 1, total: 30, color: 'var(--accent)' },
];

const COURSES = [
  {
    title: 'Tajweed Fundamentals',
    icon: '📖',
    level: 'Beginner',
    description: 'Learn the rules of correct Quranic pronunciation — makharij, noon sakinah, qalqalah, and the gentle art of recitation.',
    lessons: 18,
  },
  {
    title: 'Juz Amma for Beginners',
    icon: '🌙',
    level: 'Beginner',
    description: "Start your Hifz journey with the 37 short surahs of the 30th Juz, taught ayah by ayah with repetition drills.",
    lessons: 24,
  },
  {
    title: 'Memorize with Meaning',
    icon: '💡',
    level: 'Intermediate',
    description: 'Pair each memorized ayah with its translation and context, so retention comes from understanding, not just repetition.',
    lessons: 30,
  },
  {
    title: 'Tafsir for Beginners',
    icon: '🕊️',
    level: 'Beginner',
    description: 'A gentle introduction to the meanings behind the verses — historical context, lessons, and reflection prompts for daily life.',
    lessons: 20,
  },
];

const SURAH_OPTIONS = [
  { value: 'juz-amma', label: 'Juz Amma (Surahs 78–114)' },
  { value: 'al-baqarah', label: 'Al-Baqarah' },
  { value: 'yaseen-mulk', label: 'Yaseen & Al-Mulk' },
  { value: 'full-quran', label: 'Full Quran (long-term)' },
];

export default function Learn() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    ayahsPerDay: '5',
    revisionCadence: '7',
    targetSurahs: 'juz-amma',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please share your name and email so we can send your plan.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccess(true);
      setForm({
        name: '',
        email: '',
        ayahsPerDay: '5',
        revisionCadence: '7',
        targetSurahs: 'juz-amma',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong building your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="learn-page">
      {/* Compact Hero */}
      <section className="hero" style={{ minHeight: '46vh' }}>
        <img className="hero-bg" src="https://picsum.photos/seed/learnhero1/1600/900" alt="Open prayer mat beside a Quran in soft morning light" />
        <div className="container">
          <span className="eyebrow hero-eyebrow">Hifz &amp; Learning</span>
          <h1>Your Hifz journey, <span className="gradient-text">witnessed</span> and remembered.</h1>
          <p className="hero-subtitle">Hifz is not a race. It's a relationship, repeated daily.</p>
        </div>
      </section>

      {/* Section 1: Progress Dashboard */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Progress Dashboard</span>
            <h2>Every ayah you keep, counted with care.</h2>
            <p>Watch your memorization grow, ayah by ayah — no pressure, only gentle accounting of what you've carried so far.</p>
          </div>

          <div className="grid grid-3">
            {PROGRESS_RINGS.map((ring, i) => {
              const pct = Math.round((ring.value / ring.total) * 100);
              const circumference = 2 * Math.PI * 54;
              const offset = circumference - (pct / 100) * circumference;
              return (
                <div className={`card animate-in-delay-${(i % 3) + 1}`} key={ring.label} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
                      <circle
                        cx="70"
                        cy="70"
                        r="54"
                        fill="none"
                        stroke={ring.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 70 70)"
                      />
                      <text x="70" y="65" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--text)" fontFamily="var(--font-display)">
                        {ring.value}
                      </text>
                      <text x="70" y="86" textAnchor="middle" fontSize="12" fill="var(--muted)">
                        of {ring.total} surahs
                      </text>
                    </svg>
                  </div>
                  <h3>{ring.label}</h3>
                  <p style={{ color: 'var(--muted)' }}>
                    {ring.label === 'Memorized' && 'Fully retained and ready for review at any time.'}
                    {ring.label === 'In Progress' && "You're actively building these — steady repetition is working."}
                    {ring.label === 'Due for Revision' && 'It has been a while — a gentle nudge to revisit these soon.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider motif */}
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 auto', maxWidth: '400px' }}>
          <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14 9L21 10L14 15L16 22L12 18L8 22L10 15L3 10L10 9L12 2Z" fill="var(--accent)" />
          </svg>
          <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
        </div>
      </div>

      {/* Section 2: Daily Plan Builder (FORM) */}
      <section className="section">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">Daily Plan Builder</span>
            <h2>A plan as patient as you are.</h2>
            <p>Tell us your pace. We'll build the path — a realistic daily memorization and revision schedule built around your life, not against it.</p>
          </div>

          <div className="card" style={{ padding: '40px' }}>
            {success ? (
              <div className="alert alert-success" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <h3 style={{ marginBottom: '8px' }}>✓ Your plan is on its way!</h3>
                <p style={{ margin: 0 }}>
                  Your plan starts tomorrow. We'll remind you by email when it's time to memorize and when it's time to revise.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Link to="/surahs">
                    <Button variant="primary">Browse Surahs to Begin</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-2" style={{ gap: '20px' }}>
                  <Input
                    label="Your Name"
                    placeholder="Amina Rahman"
                    value={form.name}
                    onChange={handleChange('name')}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                </div>

                <div className="grid grid-2" style={{ gap: '20px', marginTop: '4px' }}>
                  <Select
                    label="Ayahs per day"
                    value={form.ayahsPerDay}
                    onChange={handleChange('ayahsPerDay')}
                    options={[
                      { value: '1', label: '1 ayah / day — gentle start' },
                      { value: '3', label: '3 ayahs / day — steady' },
                      { value: '5', label: '5 ayahs / day — committed' },
                      { value: '10', label: '10 ayahs / day — intensive' },
                    ]}
                  />
                  <Select
                    label="Revision cadence"
                    value={form.revisionCadence}
                    onChange={handleChange('revisionCadence')}
                    options={[
                      { value: '3', label: 'Every 3 days' },
                      { value: '7', label: 'Weekly' },
                      { value: '14', label: 'Every two weeks' },
                    ]}
                  />
                </div>

                <div style={{ marginTop: '4px' }}>
                  <Select
                    label="Target surahs / juz"
                    value={form.targetSurahs}
                    onChange={handleChange('targetSurahs')}
                    options={SURAH_OPTIONS}
                  />
                </div>

                {error && (
                  <div style={{ marginTop: '20px' }}>
                    <Alert variant="error" title="Couldn't build your plan">{error}</Alert>
                  </div>
                )}

                <div style={{ marginTop: '28px' }}>
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                    {loading ? 'Building your plan…' : 'Build My Plan'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Courses & Guided Paths */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Courses &amp; Guided Paths</span>
            <h2>Guided structure for the self-taught heart.</h2>
            <p>Structured paths for wherever you stand — your first surah or your thirtieth juz.</p>
          </div>

          <div className="grid grid-2">
            {COURSES.map((course, i) => (
              <div className={`card feature-card animate-in-delay-${(i % 4) + 1}`} key={course.title}>
                <div className="feature-icon" style={{ fontSize: '1.8rem' }}>{course.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0 }}>{course.title}</h3>
                  <Badge variant={course.level === 'Beginner' ? 'success' : 'warning'} size="sm">{course.level}</Badge>
                </div>
                <p style={{ color: 'var(--muted)' }}>{course.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{course.lessons} lessons</span>
                  <Button variant="secondary" size="sm">View Curriculum</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Revision Reminders */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <div>
              <span className="eyebrow">Revision Reminders</span>
              <h2>What you memorized last month deserves to be remembered this month too.</h2>
              <p style={{ color: 'var(--muted)', marginTop: '16px' }}>
                Islm uses a gentle, spaced-repetition rhythm to nudge you back to surahs you've already memorized —
                before they begin to fade. Reminders arrive by email or notification, timed to your own revision cadence,
                never overwhelming, always encouraging.
              </p>
              <ul style={{ marginTop: '20px', color: 'var(--muted)', lineHeight: '2' }}>
                <li>✓ Smart scheduling based on how long ago you memorized each surah</li>
                <li>✓ Weekly summary of what's due and what's secure</li>
                <li>✓ Snooze or reschedule a revision without losing your streak</li>
              </ul>
              <div style={{ marginTop: '28px' }}>
                <Link to="/bookmarks">
                  <Button variant="ghost">View Your Saved Ayahs</Button>
                </Link>
              </div>
            </div>
            <div>
              <img
                src="https://picsum.photos/seed/revision5/700/560"
                alt="Hands turning the pages of a Quran with tasbih prayer beads resting nearby"
                width="700"
                height="560"
                className="img-cover img-rounded img-shadow"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <div className="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff' }}>Begin where you are.</h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', maxWidth: '560px', margin: '12px auto 28px' }}>
            Whether it's your first ayah or your thirtieth juz, your next step in Hifz starts with a single page.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/surahs" className="btn-secondary">Start Your First Juz</Link>
            <Link to="/quran" className="btn-primary" style={{ background: '#fff', color: 'var(--primary)' }}>Open the Mushaf</Link>
          </div>
        </div>
      </div>
    </div>
  );
}