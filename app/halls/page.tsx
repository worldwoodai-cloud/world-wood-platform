'use client';

import { motion } from 'framer-motion';
import { Film, Info, ArrowRight } from 'lucide-react';
import HallCard from '@/components/HallCard';

export default function HallsPage() {
  const halls = [
    { id: 'scifi', name: 'Sci-Fi & Future', description: 'Exploring the boundaries of technology, time travel, and cybernetic evolution.', poster: '/scifi-hall.png', count: 24 },
    { id: 'action', name: 'Action & Spectacle', description: 'Visceral sequences, high-octane chases, and grand-scale cinematic thrills.', poster: '/action-hall.png', count: 18 },
    { id: 'fantasy', name: 'Fantasy & Myth', description: 'Ancient magic, mythical beasts, and legendary quests in distant realms.', poster: '/fantasy-hall.png', count: 15 },
    { id: 'horror', name: 'Horror & Dark Cinema', description: 'The psychological depths of fear, suspense, and the supernatural.', poster: '/horror-hall.png', count: 12 },
    { id: 'experimental', name: 'Experimental & Shorts', description: 'Boundary-pushing narratives, abstract visuals, and short-form digital art.', poster: '/experimental-hall.png', count: 32 },
    { id: 'documentary', name: 'Documentary', description: 'Real-world stories, investigative journeys, and digital history.', poster: '/documentary-hall.png', count: 10 },
  ];

  return (
    <div className="halls-page">
      <div className="halls-hero">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="title"
          >
            Cinema <span className="accent-text">Halls</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="subtitle"
          >
            Each hall is a dedicated theatre screen curated for specific genres and digital experiences.
          </motion.p>
        </div>
      </div>

      <div className="halls-grid container">
        {halls.map((hall, i) => (
          <motion.div
            key={hall.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="hall-header">
              <span className="hall-index">0{i + 1}</span>
              <div className="line"></div>
            </div>
            <HallCard {...hall} />
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .halls-page {
          padding-top: 150px;
          min-height: 100vh;
          padding-bottom: 100px;
        }
        .halls-hero {
          margin-bottom: 6rem;
        }
        .halls-hero .title {
          font-size: 5rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }
        .halls-hero .subtitle {
          font-size: 1.4rem;
          color: var(--grey);
          max-width: 600px;
        }
        .halls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 6rem 4rem;
        }
        .hall-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .hall-index {
          font-size: 0.8rem;
          font-weight: 900;
          color: var(--accent);
          letter-spacing: 2px;
        }
        .line {
          flex: 1;
          height: 1px;
          background: var(--glass-border);
        }
        @media (max-width: 1024px) {
          .halls-grid { grid-template-columns: 1fr; }
          .halls-hero .title { font-size: 3.5rem; }
        }
      `}</style>
    </div>
  );
}
