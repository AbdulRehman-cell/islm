import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [surahError, setSurahError] = useState('');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchSurahs = async () => {
      try {
        setLoadingSurahs(true);
        const res = await axios.get('/api/surahs');
        if (mounted) setSurahs(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
      } catch (e) {
        if (mounted) setSurahError(e.response?.data?.error || 'Could not load surahs right now.');
      } finally {
        if (mounted) setLoadingSurahs(false);
      }
    };
    fetchSurahs();
    return () => { mounted = false; };
  }, []);

  const fallbackSurahs = [
    { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatihah', ayahCount: 7, revelationType: 'Meccan' },
    { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', ayahCount: 286, revelationType: 'Medinan' },
    { number: 36, nameArabic: 'يس', nameEnglish: 'Ya-Sin', ayahCount: 83, revelationType: 'Meccan' },
    { number: 55, nameArabic: 'الرحمن', nameEnglish: 'Ar-Rahman', ayahCount: 78, revelationType: 'Medinan' },
    { number: 67, nameArabic: 'الملك', nameEnglish: 'Al-Mulk', ayahCount: 30, revelationType: 'Meccan' },
    { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', ayahCount: 4, revelationType: 'Meccan' }
  ];

  const displaySurahs = (surahs && surahs.length > 0) ? surahs : fallbackSurahs;

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/contactmessages', {
        name: 'Newsletter Subscriber',
        email,
        message: 'Requested to join the Islm newsletter from the Home page CTA.'
      });
      setSuccess(true);
      setEmail('');
    } catch (e2) {
      setError(e2.response?.data?.error || 'We could not process that right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="islm-home">
      {/* HERO */}
      <section className="hero">
        <img className="hero-bg" src="https://picsum.photos/seed/hero1/1600/900" alt="" />
        <div className="container">
          <span className="eyebrow">Islm · Quranic Learning & Reading</span>
          <h1>Draw near to the <span className="gradient-text">Word.</span></h1>
          <p className="hero-subtitle" lang="ar" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)', lineHeight: 2.1 }}>
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </p>
          <p className="hero-subtitle">
            "Read. In the name of your Lord who created." A serene digital sanctuary for reading,
            memorizing, and understanding the Quran — built for sincere beginners and lifelong students alike.
          </p>
          <div className="hero-actions">
            <Link to="/surahs" className="btn-primary">Begin Reading</Link>
            <Link to="/learn" className="btn-secondary">Book a Class</Link>
          </div>
        </div>
      </section>

      {/* SEARCH BY SURAH STRIP */}
      <section className="section" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <div className="container">
          <div className="card animate-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0 }}>Find your surah — by name, by number, or by memory.</h3>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>Search across all 114 surahs in a single, unhurried view.</p>
            </div>
            <Link to="/surahs" className="btn-primary">Open Surah Index →</Link>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Why Islm</span>
            <h2>Everything you need, nothing that distracts.</h2>
            <p>Three companions for one journey — a clear Mushaf, a patient memorization guide, and reflections that meet you where you are.</p>
          </div>
          <div className="grid grid-3">
            <div className="feature-card animate-in">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5V4.5Z" stroke="var(--primary)" strokeWidth="1.6"/><path d="M20 18v2.5A2.5 2.5 0 0 1 17.5 23H4" stroke="var(--primary)" strokeWidth="1.6"/></svg>
              </div>
              <h3>Read</h3>
              <p>114 surahs rendered with the clarity of ink on parchment — Uthmani script, tajweed coloring, and a translation toggle beneath every ayah.</p>
            </div>
            <div className="feature-card animate-in animate-in-delay-1">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--primary)" strokeWidth="1.6"/><path d="M12 7v5l3 2" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3>Memorize</h3>
              <p>A patient Hifz tracker that watches your memorization grow, ayah by ayah, with gentle spaced revision reminders.</p>
            </div>
            <div className="feature-card animate-in animate-in-delay-2">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16.65 12 21 12 21Z" stroke="var(--primary)" strokeWidth="1.6"/></svg>
              </div>
              <h3>Reflect</h3>
              <p>Tafsir notes and reflections that meet you where you stand — your first surah or your thirtieth juz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER MOTIF */}
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 auto', maxWidth: '420px' }}>
          <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5L12 0Z"/></svg>
          <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
        </div>
      </div>

      {/* MUSHAF EXPERIENCE SHOWCASE */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">The Mushaf Experience</span>
            <h2>A reading experience worthy of the text.</h2>
            <p>114 surahs, rendered with the clarity of ink on parchment — not the glare of an ordinary screen.</p>
          </div>
          <div className="grid grid-2">
            <div className="animate-in">
              <img className="img-cover img-rounded img-shadow" src="https://picsum.photos/seed/mushaf2/900/700" alt="Open Mushaf with visible Arabic script resting on a wooden stand" width="900" height="700" style={{ width: '100%', height: 'auto', aspectRatio: '9/7' }} />
            </div>
            <div className="animate-in animate-in-delay-1">
              <div style={{ background: 'var(--surface-2)', borderLeft: '3px solid var(--secondary)', borderRadius: '0 14px 14px 0', padding: '32px' }}>
                <p lang="ar" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)', lineHeight: 2.1, textAlign: 'center', color: 'var(--text)' }}>
                  وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِنْ مُدَّكِرٍ
                </p>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>
                  <p style={{ color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
                    "And We have certainly made the Quran easy for remembrance, so is there any who will remember?" — Al-Qamar 54:17
                  </p>
                </div>
              </div>
              <ul style={{ marginTop: '24px', listStyle: 'none', padding: 0, display: 'grid', gap: '12px' }}>
                <li className="card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-primary">Toggle</span> Switch between Arabic-only, translation, or both.
                </li>
                <li className="card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-primary">Tajweed</span> Color-coded rules for confident recitation.
                </li>
                <li className="card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-primary">Audio</span> Listen to trusted reciters, ayah by ayah.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SURAHS GRID */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Featured Surahs</span>
            <h2>Start with a surah close to the heart.</h2>
            <p>A handful of beloved chapters to welcome you into the Mushaf — the full index awaits in the reader.</p>
          </div>

          {surahError && (
            <div className="alert alert-error" style={{ marginBottom: '24px' }}>{surahError}</div>
          )}

          {loadingSurahs ? (
            <div className="grid grid-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card" style={{ height: '150px', opacity: 0.6 }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-2)', marginBottom: '16px' }} />
                  <div style={{ width: '70%', height: '16px', background: 'var(--surface-2)', borderRadius: '6px', marginBottom: '8px' }} />
                  <div style={{ width: '50%', height: '12px', background: 'var(--surface-2)', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-3">
              {displaySurahs.map((s, idx) => (
                <Link
                  to={`/surah/${s.number ?? idx + 1}`}
                  key={s._id || s.number || idx}
                  className="card animate-in"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      border: '1px solid var(--accent)', background: 'var(--surface-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)'
                    }}>
                      {s.number ?? idx + 1}
                    </div>
                    <div>
                      <h3 style={{ margin: 0 }}>{s.nameEnglish || 'Surah'}</h3>
                      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{s.revelationType || 'Meccan'} · {s.ayahCount ?? '—'} ayahs</p>
                    </div>
                  </div>
                  <p lang="ar" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', textAlign: 'right', color: 'var(--text)', margin: 0 }}>
                    {s.nameArabic || ''}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/surahs" className="btn-secondary">View All 114 Surahs</Link>
          </div>
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Learning Paths</span>
            <h2>Learning, paced like prayer.</h2>
            <p>Structured paths for wherever you stand — your first surah or your thirtieth juz.</p>
          </div>
          <div className="grid grid-4">
            <div className="card animate-in">
              <div className="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="var(--primary)" strokeWidth="1.6"/></svg></div>
              <h3>Hifz Tracker</h3>
              <p>Track memorized surahs with soft progress rings and spaced revision.</p>
            </div>
            <div className="card animate-in animate-in-delay-1">
              <div className="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--primary)" strokeWidth="1.6"/></svg></div>
              <h3>Tajweed Basics</h3>
              <p>Learn the rules of recitation with color-coded guidance on real ayahs.</p>
            </div>
            <div className="card animate-in animate-in-delay-2">
              <div className="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19.5V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2Z" stroke="var(--primary)" strokeWidth="1.6"/></svg></div>
              <h3>Tafsir for Beginners</h3>
              <p>Short, trustworthy reflections that unpack meaning without overwhelming.</p>
            </div>
            <div className="card animate-in animate-in-delay-3">
              <div className="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-8-8" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round"/></svg></div>
              <h3>Daily Habit Builder</h3>
              <p>Small, sustainable daily goals that compound into lasting connection.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/learn" className="btn-primary">Explore Learning Paths</Link>
          </div>
        </div>
      </section>

      {/* TEACHER / COURSE SPOTLIGHT */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Guided Classes</span>
            <h2>Learn alongside a patient teacher.</h2>
            <p>Live and recorded classes with certified instructors, paced for sincere beginners and returning students.</p>
          </div>
          <div className="grid grid-3">
            <div className="card-elevated animate-in">
              <img className="avatar" src="https://i.pravatar.cc/300?img=12" alt="Ustadh Bilal, Tajweed instructor" width="72" height="72" style={{ marginBottom: '16px' }} />
              <h3>Ustadh Bilal Rahman</h3>
              <p style={{ color: 'var(--muted)' }}>Tajweed & Qira'at · 14 years teaching</p>
              <p>"Every mouth, every tongue is different — I teach the rule, and let the student find their own rhythm."</p>
              <span className="badge badge-primary">Live Thursdays, 7PM</span>
            </div>
            <div className="card-elevated animate-in animate-in-delay-1">
              <img className="avatar" src="https://i.pravatar.cc/300?img=47" alt="Ustadha Sumayyah, Hifz coach" width="72" height="72" style={{ marginBottom: '16px' }} />
              <h3>Ustadha Sumayyah Noor</h3>
              <p style={{ color: 'var(--muted)' }}>Hifz Coaching · Huffaz-certified</p>
              <p>"Hifz is not a race. It's a relationship, repeated daily, with grace for the slow days."</p>
              <span className="badge badge-primary">Live Saturdays, 10AM</span>
            </div>
            <div className="card-elevated animate-in animate-in-delay-2">
              <img className="avatar" src="https://i.pravatar.cc/300?img=33" alt="Shaykh Idris, Tafsir teacher" width="72" height="72" style={{ marginBottom: '16px' }} />
              <h3>Shaykh Idris Anwar</h3>
              <p style={{ color: 'var(--muted)' }}>Tafsir & Meaning · Dual-ijazah</p>
              <p>"Understanding a verse should feel like sitting with a teacher who has time for you."</p>
              <span className="badge badge-primary">Live Sundays, 5PM</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/learn" className="btn-secondary">See Full Class Schedule</Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Moments of Stillness</span>
            <h2>A quiet space for a timeless text.</h2>
            <p>Glimpses from our community — reading at sunrise, turning pages with intention, learning in quiet halls.</p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery1/700/560" alt="Person reading the Quran at sunrise beside a window" width="700" height="560" />
              <div className="gallery-overlay"><span>Sunrise reading</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery2/700/560" alt="Hands turning Quran pages with tasbih beads nearby" width="700" height="560" />
              <div className="gallery-overlay"><span>Turning the page</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery3/700/560" alt="Interior of a quiet mosque library with warm light" width="700" height="560" />
              <div className="gallery-overlay"><span>The study hall</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/gallery4/700/560" alt="Open Mushaf page with visible Arabic script" width="700" height="560" />
              <div className="gallery-overlay"><span>Ink on parchment</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Hear a Recitation</span>
            <h2>Where recitation becomes reflection.</h2>
            <p>A short recitation to welcome you into the stillness Islm is built to protect.</p>
          </div>
          <div className="video-embed animate-in" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <iframe
              src="https://www.youtube.com/embed/1E2H5xDC1ZQ"
              title="Quran recitation sample"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Islm in Numbers</span>
            <h2>Students who returned, and stayed.</h2>
          </div>
          <div className="grid grid-4">
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="stat-value">114</div>
              <div className="stat-label">Surahs Available</div>
            </div>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="stat-value">12</div>
              <div className="stat-label">Certified Reciters</div>
            </div>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="stat-value">28,400+</div>
              <div className="stat-label">Students Learning</div>
            </div>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="stat-value">40</div>
              <div className="stat-label">Countries Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head animate-in">
            <span className="eyebrow">Student Voices</span>
            <h2>Students who returned, and stayed.</h2>
            <p>Reflections from learners walking their own unhurried path through the Mushaf.</p>
          </div>
          <div className="grid grid-3">
            <div className="testimonial animate-in">
              <p className="testimonial-text">"Islm didn't rush me. It let the Quran set the pace."</p>
              <div className="testimonial-author">
                <img className="avatar" src="https://i.pravatar.cc/300?img=5" alt="Amina R." width="48" height="48" />
                <div>
                  <strong>Amina R.</strong>
                  <p className="testimonial-role">Student of Hifz</p>
                </div>
              </div>
            </div>
            <div className="testimonial animate-in animate-in-delay-1">
              <p className="testimonial-text">"The tajweed coloring finally made the rules click — I read with confidence now."</p>
              <div className="testimonial-author">
                <img className="avatar" src="https://i.pravatar.cc/300?img=23" alt="Yusuf K." width="48" height="48" />
                <div>
                  <strong>Yusuf K.</strong>
                  <p className="testimonial-role">Beginner reader</p>
                </div>
              </div>
            </div>
            <div className="testimonial animate-in animate-in-delay-2">
              <p className="testimonial-text">"I revise on my commute now. The reminders feel like a gentle nudge, never a guilt trip."</p>
              <div className="testimonial-author">
                <img className="avatar" src="https://i.pravatar.cc/300?img=36" alt="Maryam S." width="48" height="48" />
                <div>
                  <strong>Maryam S.</strong>
                  <p className="testimonial-role">Working professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container container-narrow">
          <div className="section-head animate-in">
            <span className="eyebrow">Questions</span>
            <h2>Before you begin.</h2>
            <p>A few things students often ask before opening their first surah.</p>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="card animate-in">
              <h3>Is Islm free to use?</h3>
              <p>Reading, bookmarking, and the Hifz tracker are free. Live classes with teachers carry a modest fee to sustain their time.</p>
            </div>
            <div className="card animate-in animate-in-delay-1">
              <h3>What text and translations do you use?</h3>
              <p>We use the verified Uthmani script, with translations reviewed by scholars for accuracy and clarity.</p>
            </div>
            <div className="card animate-in animate-in-delay-2">
              <h3>Can I track memorization across devices?</h3>
              <p>Yes — your Hifz progress and bookmarks are saved to your account and follow you anywhere you sign in.</p>
            </div>
            <div className="card animate-in animate-in-delay-3">
              <h3>Do you offer live teachers?</h3>
              <p>Yes — our Learn page lists certified instructors offering live Tajweed, Hifz, and Tafsir classes weekly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA + NEWSLETTER */}
      <section className="cta-section animate-in">
        <div className="container">
          <h2>Your next verse is waiting.</h2>
          <p>Begin where you are. No rush, no pressure — just the Quran, held with the care it deserves.</p>

          {success ? (
            <div className="alert alert-success" style={{ maxWidth: '520px', margin: '24px auto 0' }}>
              ✓ You're in. Welcome to Islm — watch your inbox for your first reflection.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ maxWidth: '480px', margin: '32px auto 0', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: '1 1 240px' }}
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting…' : 'Join Our Newsletter'}
              </button>
            </form>
          )}
          {error && (
            <div className="alert alert-error" style={{ maxWidth: '480px', margin: '16px auto 0' }}>{error}</div>
          )}

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '32px' }}>
            <Link to="/surahs" className="btn-secondary">Open the Mushaf</Link>
          </div>
        </div>
      </section>
    </div>
  );
}