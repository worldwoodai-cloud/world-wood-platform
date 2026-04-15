'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Film, MapPin, ChevronRight, Filter, Play, Users, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

const demoSchedule = [
  {
    time: '14:00', title: 'The Omega Point', studio: 'Neon Frontier Studios', hall: 'Sci-Fi & Future',
    hallSlug: 'scifi', runtime: '24m', type: 'PREMIERE', isLive: true, viewers: 12400,
  },
  {
    time: '15:30', title: 'Realm of Echoes', studio: 'Solaris Digital', hall: 'Fantasy & Myth',
    hallSlug: 'fantasy', runtime: '35m', type: 'FEATURED SCREENING', isLive: false, viewers: 0,
  },
  {
    time: '17:00', title: 'The Hollow', studio: 'Midnight Reel Co.', hall: 'Horror & Dark Cinema',
    hallSlug: 'horror', runtime: '19m', type: 'PREMIERE', isLive: false, viewers: 0,
  },
  {
    time: '18:30', title: 'Fracture Lines', studio: 'Aether Collective', hall: 'Experimental & Shorts',
    hallSlug: 'experimental', runtime: '8m', type: 'SHORT FILM', isLive: false, viewers: 0,
  },
  {
    time: '19:00', title: 'Iron Resolve', studio: 'Pulse Motion Pictures', hall: 'Action & Spectacle',
    hallSlug: 'action', runtime: '28m', type: 'FEATURED SCREENING', isLive: false, viewers: 0,
  },
  {
    time: '20:00', title: 'Circuit Stories', studio: 'Verdant Eye Films', hall: 'Documentary',
    hallSlug: 'documentary', runtime: '45m', type: 'DOCUMENTARY PREMIERE', isLive: false, viewers: 0,
  },
  {
    time: '21:30', title: 'Neural Drift', studio: 'Pulse Motion Pictures', hall: 'Sci-Fi & Future',
    hallSlug: 'scifi', runtime: '18m', type: 'LATE NIGHT SCREENING', isLive: false, viewers: 0,
  },
  {
    time: '22:30', title: 'Whisper House', studio: 'Midnight Reel Co.', hall: 'Horror & Dark Cinema',
    hallSlug: 'horror', runtime: '15m', type: 'MIDNIGHT SCREENING', isLive: false, viewers: 0,
  },
];

const tomorrowSchedule = [
  {
    time: '13:00', title: 'Void Canvas', studio: 'Aether Collective', hall: 'Experimental & Shorts',
    hallSlug: 'experimental', runtime: '12m', type: 'PREMIERE', isLive: false, viewers: 0,
  },
  {
    time: '15:00', title: 'The Verdant Throne', studio: 'Aether Collective', hall: 'Fantasy & Myth',
    hallSlug: 'fantasy', runtime: '20m', type: 'FEATURED SCREENING', isLive: false, viewers: 0,
  },
  {
    time: '17:30', title: 'Storm Chaser', studio: 'Neon Frontier Studios', hall: 'Action & Spectacle',
    hallSlug: 'action', runtime: '22m', type: 'ACTION SHOWCASE', isLive: false, viewers: 0,
  },
  {
    time: '19:00', title: 'Quantum Echo', studio: 'Solaris Digital', hall: 'Sci-Fi & Future',
    hallSlug: 'scifi', runtime: '32m', type: 'PREMIERE', isLive: false, viewers: 0,
  },
  {
    time: '21:00', title: 'The Last Frame', studio: 'Verdant Eye Films', hall: 'Documentary',
    hallSlug: 'documentary', runtime: '38m', type: 'DOCUMENTARY PREMIERE', isLive: false, viewers: 0,
  },
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const { data, error } = await supabase
          .from('films')
          .select('*, studios(name), halls(name)')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        let dbFilms: any[] = [];
        if (!error && data && data.length > 0) {
          dbFilms = data.map((item: any, i: number) => ({
            time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: item.title,
            studio: item.studios?.name || 'Unknown Studio',
            hall: item.halls?.name || 'Main Hall',
            hallSlug: item.halls?.slug || 'scifi',
            runtime: `${item.runtime_minutes}m`,
            type: i === 0 ? 'FEATURED SCREENING' : 'SCREENING',
            isLive: i === 0,
            viewers: i === 0 ? 8500 : 0,
          }));
        }

        // Merge demo approved films from localStorage
        if (typeof window !== 'undefined' && localStorage.getItem('nexa-demo-session')) {
          const demoFilms = JSON.parse(localStorage.getItem('nexa-demo-films') || '[]');
          const approvedDemo = demoFilms
            .filter((f: any) => f.status === 'approved')
            .map((f: any, i: number) => ({
              time: new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              title: f.title,
              studio: f.studios?.name || 'Demo Studio',
              hall: 'Main Hall',
              hallSlug: 'scifi',
              runtime: '0m',
              type: 'PREMIERE',
              isLive: i === 0,
              viewers: i === 0 ? 1200 : 0,
            }));
          dbFilms = [...approvedDemo, ...dbFilms];
        }

        if (dbFilms.length > 0) {
          setFilms(dbFilms);
        } else {
          // Use demo schedule
          setFilms(selectedDay === 'Today' ? demoSchedule : selectedDay === 'Tomorrow' ? tomorrowSchedule : demoSchedule);
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setFilms(demoSchedule);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, [selectedDay]);

  const today = new Date();
  const days = [
    'Today',
    'Tomorrow',
    new Date(today.getTime() + 2 * 86400000).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    new Date(today.getTime() + 3 * 86400000).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    new Date(today.getTime() + 4 * 86400000).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
  ];

  const currentFilms = films;

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div className="loading-spinner" />
        <span style={{ color: 'var(--grey)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Syncing Schedule...</span>
      </div>
    );
  }

  return (
    <div className="schedule-page">
      <div className="container">
        <header className="page-header">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="title">
              Screening <span className="accent-text">Schedule</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="subtitle">
              Live and upcoming screenings across all cinema halls
            </motion.p>
          </div>
          <div className="day-picker glass">
            {days.map(day => (
              <button
                key={day}
                className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </header>

        <section className="timeline-section">
          <div className="filter-bar">
            <div className="results-count">{currentFilms.length} SCREENINGS SCHEDULED</div>
            <button className="btn-filter"><Filter size={16} /> Filters</button>
          </div>

          <div className="schedule-list">
            {currentFilms.map((item, i) => (
              <motion.div
                key={`${item.title}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`schedule-card glass ${item.isLive ? 'is-live' : ''}`}
              >
                <div className="time-col">
                  <div className="time">{item.time}</div>
                  {item.isLive && (
                    <span className="live-tag">
                      <span className="live-dot"></span> LIVE NOW
                    </span>
                  )}
                </div>

                <div className="info-col">
                  <div className="event-type">{item.type}</div>
                  <h2 className="film-title">{item.title}</h2>
                  <div className="meta">
                    <span><Film size={14} /> {item.studio}</span>
                    <span><MapPin size={14} /> {item.hall}</span>
                    <span><Clock size={14} /> {item.runtime}</span>
                    {item.isLive && item.viewers > 0 && (
                      <span className="viewers-count"><Users size={14} /> {(item.viewers / 1000).toFixed(1)}K watching</span>
                    )}
                  </div>
                </div>

                <div className="action-col">
                  {item.isLive ? (
                    <Link href={`/halls/${item.hallSlug}`} className="btn-primary join-btn">
                      <Play fill="white" size={14} /> JOIN LIVE
                    </Link>
                  ) : (
                    <button className="btn-glass" onClick={() => alert(`Reminder set for ${item.title} at ${item.time}`)}>
                      SET REMINDER
                    </button>
                  )}
                  <Link href={`/halls/${item.hallSlug}`} className="btn-icon"><ChevronRight size={20} /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .schedule-page {
          padding-top: 150px;
          min-height: 100vh;
          padding-bottom: 100px;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 4rem;
        }
        .title {
          font-size: 4rem;
          font-weight: 900;
        }
        .subtitle {
          color: var(--grey);
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }
        .day-picker {
          display: flex;
          padding: 0.5rem;
          border-radius: 50px;
          gap: 0.3rem;
        }
        .day-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--grey);
          transition: var(--transition);
          white-space: nowrap;
        }
        .day-btn:hover { color: white; }
        .day-btn.active {
          background: var(--accent);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 27, 28, 0.3);
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          color: var(--grey);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .btn-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
        }

        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .schedule-card {
          display: flex;
          align-items: center;
          padding: 2rem 2.5rem;
          border-radius: 12px;
          gap: 3rem;
          transition: var(--transition);
        }
        .schedule-card:hover {
          background: rgba(255,255,255,0.06);
          transform: translateX(8px);
        }
        .schedule-card.is-live {
          border-left: 4px solid var(--accent);
          background: rgba(255, 27, 28, 0.05);
        }

        .time-col {
          min-width: 130px;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .time {
          font-size: 1.6rem;
          font-weight: 900;
          font-family: monospace;
        }
        .live-tag {
          font-size: 0.6rem;
          font-weight: 900;
          color: var(--accent);
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          animation: livePulse 1.5s infinite;
        }

        .event-type {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          letter-spacing: 1.5px;
        }
        .film-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 0.6rem;
        }
        .meta {
          display: flex;
          gap: 1.5rem;
          color: var(--grey);
          font-weight: 600;
          font-size: 0.85rem;
          flex-wrap: wrap;
        }
        .meta span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .viewers-count {
          color: var(--accent) !important;
          font-weight: 700 !important;
        }

        .info-col { flex: 1; }

        .action-col {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .join-btn {
          gap: 0.5rem;
          white-space: nowrap;
        }
        .btn-icon {
          color: var(--grey);
          transition: var(--transition);
        }
        .btn-icon:hover { color: white; }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .schedule-card { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding: 1.5rem; }
          .page-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .day-picker { width: 100%; overflow-x: auto; }
          .title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
