'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Info } from 'lucide-react';
import Link from 'next/link';

interface FilmCardProps {
    id: string;
    title: string;
    poster: string;
    hall: string;
    runtime: string;
    isPremiere?: boolean;
}

export default function FilmCard({ id, title, poster, hall, runtime, isPremiere }: FilmCardProps) {
    return (
        <Link href={`/films/${id}`} className="film-link">
            <motion.div
                className="film-card"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="card-media">
                    <img src={poster} alt={title} />
                    <div className="card-overlay">
                        <div className="play-btn-circle">
                            <Play fill="white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card-content">
                    {isPremiere && (
                        <div className="premiere-badge">
                            Premiere
                        </div>
                    )}
                    
                    <span className="hall-tag">{hall}</span>
                    <h3 className="film-title">{title}</h3>
                    
                    <div className="card-meta">
                        <div className="meta-item"><Clock size={14} /> <span>{runtime}</span></div>
                    </div>
                </div>

                <style jsx>{`
                  .film-link { text-decoration: none; display: block; }
                  .film-card {
                    background: var(--surface);
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid var(--glass-border);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                  }
                  .card-media { position: relative; aspect-ratio: 2/3; overflow: hidden; }
                  .card-media img {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .film-card:hover .card-media img { transform: scale(1.05); }
                  
                  .card-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%);
                    opacity: 0; transition: opacity 0.3s;
                    display: flex; align-items: center; justify-content: center;
                  }
                  .film-card:hover .card-overlay { opacity: 1; }
                  
                  .play-btn-circle {
                    width: 60px; height: 60px; background: rgba(255,27,28,0.9); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  }
                  .film-card:hover .play-btn-circle { transform: scale(1); }

                  .card-content {
                    padding: 1.5rem; position: relative;
                  }
                  
                  .premiere-badge {
                    position: absolute; top: -15px; right: 1.5rem;
                    background: var(--accent); color: white;
                    padding: 0.3rem 0.8rem; border-radius: 20px;
                    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
                    box-shadow: 0 4px 10px rgba(255,27,28,0.3);
                  }

                  .hall-tag {
                    font-size: 0.75rem; font-weight: 700; color: var(--accent);
                    margin-bottom: 0.5rem; display: block; text-transform: uppercase; letter-spacing: 1px;
                  }
                  .film-title {
                    font-size: 1.4rem; font-weight: 800; color: white; line-height: 1.2; margin-bottom: 0.8rem;
                  }

                  .card-meta {
                    display: flex; align-items: center; justify-content: space-between;
                    padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05);
                  }
                  .meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--grey); font-weight: 600; }
                `}</style>
            </motion.div>
        </Link>
    );
}
