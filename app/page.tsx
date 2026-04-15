'use client';

import Hero from '@/components/Hero';
import FilmCard from '@/components/FilmCard';
import HallCard from '@/components/HallCard';
import Link from 'next/link';
import { ArrowRight, Calendar, Trophy } from 'lucide-react';

export default function Home() {
  const nowScreening = [
    { id: 'omega', title: 'Omega Point', poster: '/omega.png', hall: 'Sci-Fi & Future', runtime: '124m', isPremiere: true },
    { id: 'fantasy', title: 'Witcher of Light', poster: '/fantasy.png', hall: 'Fantasy & Myth', runtime: '145m', isPremiere: false },
  ];

  const todaySchedule = [
    { time: '7:00 PM', title: 'Sci-Fi Premiere: Beyond Silicon', hall: 'Sci-Fi & Future', hallId: 'scifi' },
    { time: '8:30 PM', title: 'Fantasy Film: Witcher of Light', hall: 'Fantasy & Myth', hallId: 'fantasy' },
    { time: '10:00 PM', title: 'Experimental Short: Glitch Dreams', hall: 'Experimental & Shorts', hallId: 'experimental' },
  ];

  const halls = [
    { id: 'scifi', name: 'Sci-Fi & Future', description: 'Exploring the boundaries of technology, time travel, and cybernetic evolution.', poster: '/scifi-hall.png' },
    { id: 'action', name: 'Action & Spectacle', description: 'Visceral sequences, high-octane chases, and grand-scale cinematic thrills.', poster: '/action-hall.png' },
    { id: 'fantasy', name: 'Fantasy & Myth', description: 'Ancient magic, mythical beasts, and legendary quests in distant realms.', poster: '/fantasy-hall.png' },
    { id: 'horror', name: 'Horror & Dark Cinema', description: 'The psychological depths of fear, suspense, and the supernatural.', poster: '/horror-hall.png' },
  ];

  return (
    <div className="home-page">
      <Hero imageUrl="/hero.png" />

      <div className="main-layout container">
        <div className="primary-col">
          {/* Now Screening */}
          <section className="section-block">
            <div className="block-header">
              <h2 className="block-title">Now <span className="text-gradient">Screening</span></h2>
              <div className="live-pill">
                <div className="pulse-dot"></div>
                LIVE THEATRE
              </div>
            </div>
            <div className="film-grid">
              {nowScreening.map(film => (
                <FilmCard key={film.id} {...film} />
              ))}
            </div>
          </section>

          {/* Featured Halls */}
          <section className="section-block">
            <div className="block-header">
              <h2 className="block-title">Elite <span className="text-gradient">Halls</span></h2>
              <Link href="/halls" className="link-action">Explore All <ArrowRight size={16} /></Link>
            </div>
            <div className="hall-grid">
              {halls.map(hall => (
                <HallCard key={hall.id} {...hall} />
              ))}
            </div>
          </section>
        </div>

        <aside className="secondary-col">
          {/* Today's Schedule */}
          <section className="side-panel glass">
            <div className="panel-header">
              <Calendar size={20} className="accent-text" />
              <h3>Cinema Schedule</h3>
            </div>
            <div className="schedule-box">
              {todaySchedule.map((item, i) => (
                <div key={i} className="schedule-row">
                  <span className="time-tag">{item.time}</span>
                  <div className="event-detail">
                    <p className="event-name">{item.title}</p>
                    <p className="hall-name">{item.hall}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/schedule" className="btn-panel-action">View Full Calendar</Link>
          </section>

          {/* Studio Rankings */}
          <section className="side-panel glass">
            <div className="panel-header">
              <Trophy size={20} className="accent-text" />
              <h3>Studio Rankings</h3>
            </div>
            <div className="rank-list">
              {[
                { rank: 1, name: 'Neon Frontier', score: 9.8 },
                { rank: 2, name: 'Midnight Reel', score: 9.5 },
                { rank: 3, name: 'Cyber Aether', score: 9.2 }
              ].map(r => (
                <div key={r.rank} className="rank-item">
                  <span className="rank-num">0{r.rank}</span>
                  <span className="rank-name">{r.name}</span>
                  <span className="rank-score">{r.score}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Technology Section */}
      <section className="tech-breakaway">
        <div className="container tech-inner">
          <div className="tech-text">
            <span className="tech-label">TECHNOLOGY</span>
            <h2 className="tech-title">Mastering the <span className="text-gradient">8K Frontier</span></h2>
            <p className="tech-desc">Our proprietary rendering engine delivers uncompressed RAW cinematic streams with spatial audio architecture.</p>
            <div className="tech-badges">
              <div className="t-badge">RAW VIDEO</div>
              <div className="t-badge">SPATIAL AUDIO</div>
              <div className="t-badge">ULTRA LATENCY</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          background: var(--background);
          padding-bottom: 100px;
        }

        .main-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 4rem;
          margin-top: -100px;
          position: relative;
          z-index: 20;
        }

        .section-block {
          margin-bottom: 6rem;
        }

        .block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
        }

        .block-title {
          font-size: 2.5rem;
          color: white;
          letter-spacing: -0.03em;
        }

        .text-gradient {
          background: linear-gradient(90deg, #fff, var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .live-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255, 27, 28, 0.1);
          color: var(--accent);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          border: 1px solid rgba(255, 27, 28, 0.2);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        .film-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .hall-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .link-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--grey);
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .link-action:hover {
          color: white;
          gap: 0.75rem;
        }

        .secondary-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .side-panel {
          padding: 2rem;
          border-radius: 24px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1.5rem;
        }

        .panel-header h3 {
          font-size: 1.1rem;
          color: white;
          margin: 0;
        }

        .schedule-box {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .schedule-row {
          display: flex;
          gap: 1.25rem;
        }

        .time-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--accent);
          background: rgba(255, 27, 28, 0.05);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          height: fit-content;
        }

        .event-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.2rem;
        }

        .hall-name {
          font-size: 0.8rem;
          color: var(--grey);
        }

        .btn-panel-action {
          display: block;
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: white;
          font-size: 0.85rem;
          font-weight: 700;
          transition: var(--transition);
        }

        .btn-panel-action:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .rank-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rank-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
        }

        .rank-num {
          font-size: 0.7rem;
          font-weight: 900;
          color: var(--grey-dark);
          margin-right: 1rem;
        }

        .rank-name {
          flex: 1;
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
        }

        .rank-score {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--accent);
        }

        .tech-breakaway {
          margin: 6rem 0;
          padding: 8rem 0;
          background: linear-gradient(to right, #000, #0a0a0a);
          border-top: 1px solid var(--glass-border);
          border-bottom: 1px solid var(--glass-border);
        }

        .tech-text {
          max-width: 600px;
        }

        .tech-label {
          color: var(--grey);
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.3em;
          margin-bottom: 1.5rem;
          display: block;
        }

        .tech-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 2rem;
        }

        .tech-desc {
          font-size: 1.1rem;
          color: var(--grey);
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .tech-badges {
          display: flex;
          gap: 1rem;
        }

        .t-badge {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          padding: 0.5rem 1rem;
          border: 1px solid var(--grey-dark);
          border-radius: 4px;
          color: var(--grey);
        }

        @media (max-width: 1200px) {
          .main-layout {
            grid-template-columns: 1fr;
            margin-top: 0;
            padding-top: 4rem;
          }
          .secondary-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .block-title { font-size: 2rem; }
          .film-grid { grid-template-columns: 1fr; }
          .secondary-col { grid-template-columns: 1fr; }
          .tech-title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
