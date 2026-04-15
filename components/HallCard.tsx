'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Film } from 'lucide-react';
import Link from 'next/link';

interface HallCardProps {
  id: string;
  name: string;
  description: string;
  poster: string;
  count?: number;
}

export default function HallCard({ id, name, description, poster, count = 12 }: HallCardProps) {
  return (
    <Link href={`/halls/${id}`} className="hall-card">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ width: '100%', height: '100%' }}
      >
        <img src={poster} alt={name} />
        <div className="hall-card-overlay">
          <div>
            <h3 className="hall-card-name">{name}</h3>
            <p className="hall-card-desc">{description}</p>
          </div>
          <div className="hall-card-meta">
            <span className="hall-card-count">
              <Film size={16} /> {count} Films
            </span>
            <span className="hall-card-explore">
              Explore <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
