'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Film, Award, MapPin, Search, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function StudiosPage() {
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const [following, setFollowing] = useState<string[]>([]);
  const [toast, setToast] = useState<{ show: boolean, message: string } | null>(null);

  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(null), 3000);
  };

  const demoStudios = [
    { id: 'demo-1', name: 'Neon Frontier Studios', verified: true, filmCount: 12, followers: '24.5k', genre: 'Sci-Fi & Cyberpunk', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NFS&backgroundColor=8B0000', banner: 'https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&q=80&w=800' },
    { id: 'demo-2', name: 'Midnight Reel Co.', verified: true, filmCount: 8, followers: '18.2k', genre: 'Horror & Thriller', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MRC&backgroundColor=1a1a2e', banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800' },
    { id: 'demo-3', name: 'Aether Collective', verified: false, filmCount: 5, followers: '9.7k', genre: 'Experimental & Art', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=4a1a8a', banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800' },
    { id: 'demo-4', name: 'Pulse Motion Pictures', verified: true, filmCount: 15, followers: '31.0k', genre: 'Action & Adventure', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PMP&backgroundColor=cc0000', banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800' },
    { id: 'demo-5', name: 'Verdant Eye Films', verified: false, filmCount: 3, followers: '4.1k', genre: 'Documentary & Nature', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VEF&backgroundColor=0a5c36', banner: 'https://images.unsplash.com/photo-1518676590747-1e3dcf5a4e6f?auto=format&fit=crop&q=80&w=800' },
    { id: 'demo-6', name: 'Solaris Digital', verified: true, filmCount: 9, followers: '15.8k', genre: 'Fantasy & Mythology', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SD&backgroundColor=b8860b', banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFollowing(JSON.parse(localStorage.getItem('nexa-demo-following') || '[]'));
    }

    async function fetchStudios() {
      try {
        setLoading(true);
        const { data: supabaseData, error } = await supabase
          .from('studios')
          .select('*, films(id)');

        let finalStudios = [...demoStudios];

        if (typeof window !== 'undefined') {
          const localStudios = JSON.parse(localStorage.getItem('nexa-demo-studios') || '[]');
          localStudios.forEach((ls: any) => {
            if (!finalStudios.find(ds => ds.id === ls.id)) {
                finalStudios.push(ls);
            }
          });
        }

        if (supabaseData && supabaseData.length > 0) {
          supabaseData.forEach(s => {
            if (!finalStudios.find(fs => fs.id === s.id)) {
              finalStudios.push({
                ...s,
                filmCount: s.films?.length || 0,
                followers: '0',
                genre: 'General',
                logo: `https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`,
                banner: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
              });
            }
          });
        }

        setStudios(finalStudios);
      } catch (err) {
        console.error('Fetch error, using demo + local:', err);
        const localStudios = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('nexa-demo-studios') || '[]') : [];
        setStudios([...demoStudios, ...localStudios]);
      } finally {
        setLoading(false);
      }
    }
    fetchStudios();
  }, []);

  if (loading) return <div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Studios...</div>;

  return (
    <div className="studios-page">
      <div className="container">
        <div className="header">
          <div>
            <span className="accent-text label">04 / CREATIVE HUBS</span>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="title">Elite <span className="accent-text">Studios</span></motion.h1>
            <p className="subtitle">The primary production nodes powering the 2026 festival season.</p>
          </div>
          <div className="search-bar glass">
            <Search size={18} />
            <input placeholder="Search production nodes..." />
          </div>
        </div>

        {/* Featured Section */}
        <section className="featured-studios glass">
          <div className="f-content">
            <span className="badge">STUDIO OF THE MONTH</span>
            <h2>Neon Frontier Studios</h2>
            <p>Leading the industry in real-time neural rendering and spatial storytelling. Based in the New Tokyo Creative District.</p>
            <div className="f-actions">
              <button className="btn-primary">View Portfolio</button>
              <button className="btn-glass" onClick={() => triggerToast("Nexus Sync Complete: Subscribed to Featured Studio.")}>Subscribe</button>
            </div>
          </div>
          <div className="f-visual" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&q=80&w=1200)' }}></div>
        </section>

        <div className="studio-grid">
          {studios.map((studio, i) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="studio-card glass cursor-tap"
            >
              <div className="banner">
                <img src={studio.banner} alt="" />
                <div className="genre-tag">{studio.genre}</div>
              </div>
              <div className="card-content">
                <div className="logo-section">
                  <div className="logo">
                    <img src={studio.logo} alt={studio.name} />
                  </div>
                  <div className="name-meta">
                    <h3 className="name">
                      {studio.name}
                      {studio.verified && <Award size={16} className="verified" />}
                    </h3>
                    <div className="location"><MapPin size={10} /> {['New Tokyo', 'London Grid', 'SF Nexus', 'Paris Core'][i % 4]}</div>
                  </div>
                </div>
                <div className="studio-metrics">
                  <div className="metric">
                    <span>FILMS</span>
                    <strong>{studio.filmCount}</strong>
                  </div>
                  <div className="metric">
                    <span>AUDIENCE</span>
                    <strong>{studio.followers || '0'}</strong>
                  </div>
                  <div className="metric">
                    <span>RATING</span>
                    <strong>4.9</strong>
                  </div>
                </div>
                <div className="actions">
                  <button onClick={() => router.push(`/studios/${studio.id}`)} className="btn-glass full-width">View Profile</button>
                  <button 
                    onClick={() => {
                        const isFollowing = following.includes(studio.id);
                        let newFollowing;
                        if (isFollowing) {
                            newFollowing = following.filter(id => id !== studio.id);
                        } else {
                            newFollowing = [...following, studio.id];
                            triggerToast(`Nexus Connection Established: You are now synced with ${studio.name}.`);
                        }
                        setFollowing(newFollowing);
                        localStorage.setItem('nexa-demo-following', JSON.stringify(newFollowing));
                    }} 
                    className={following.includes(studio.id) ? "btn-secondary full-width" : "btn-primary full-width"}
                  >
                    {following.includes(studio.id) ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Central Tech Toast */}
      <AnimatePresence>
        {toast && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: -1 }}
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="tech-toast-container glass"
                style={{
                    padding: '3rem 5rem',
                    borderRadius: '40px',
                    border: '1px solid rgba(255, 27, 28, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    boxShadow: '0 0 100px rgba(255, 27, 28, 0.2), 0 40px 100px rgba(0,0,0,0.8)',
                    position: 'relative',
                    overflow: 'hidden',
                    maxWidth: '500px',
                    textAlign: 'center'
                }}
            >
                <div className="toast-scan-line" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, white, transparent)', opacity: 0.2 }}></div>
                <motion.div 
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    style={{ 
                        background: 'var(--accent)', 
                        borderRadius: '50%', 
                        padding: '1.5rem', 
                        display: 'flex', 
                        boxShadow: '0 0 40px var(--accent)' 
                    }}
                >
                    <Check size={40} color="white" strokeWidth={4} />
                </motion.div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <span style={{ fontWeight: 950, fontSize: '1.6rem', color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}>NODE_SYNCED</span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--grey)', lineHeight: 1.6 }}>{toast?.message}</span>
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)', letterSpacing: '2px', marginTop: '1rem' }}>
                    STATUS: ENCRYPTED_LINK_ESTABLISHED
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .studios-page { padding-top: 154px; min-height: 100vh; padding-bottom: 200px; }
        .header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 5rem; }
        .label { font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 1rem; display: block; }
        .subtitle { color: var(--grey); font-size: 1.1rem; }
        .title { font-size: 4rem; font-weight: 950; margin-bottom: 0.5rem; line-height: 1; }
        
        .featured-studios { display: grid; grid-template-columns: 1fr 1.5fr; border-radius: 24px; overflow: hidden; margin-bottom: 6rem; height: 450px; }
        .f-content { padding: 5rem; display: flex; flex-direction: column; justify-content: center; gap: 1.5rem; }
        .f-content h2 { font-size: 3rem; font-weight: 950; line-height: 1.1; }
        .f-content p { color: #ccc; font-size: 1.1rem; line-height: 1.6; max-width: 500px; }
        .f-actions { display: flex; gap: 1.5rem; }
        .f-visual { width: 100%; height: 100%; background-size: cover; background-position: center; position: relative; }
        .f-visual::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, var(--surface) 0%, transparent 100%); }

        .search-bar { display: flex; align-items: center; gap: 1rem; padding: 1.2rem 2rem; border-radius: 50px; width: 450px; }
        .search-bar input { background: transparent; border: none; color: white; width: 100%; outline: none; font-weight: 600; }
        
        .studio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 3.5rem; }
        .studio-card { border-radius: 20px; overflow: hidden; transition: var(--transition); border: 1px solid var(--glass-border); }
        .studio-card:hover { transform: translateY(-10px); border-color: var(--accent); box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        
        .banner { height: 220px; position: relative; overflow: hidden; }
        .banner img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
        .studio-card:hover .banner img { transform: scale(1.1); }
        .genre-tag { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); padding: 0.4rem 1rem; border-radius: 40px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: white; border: 1px solid rgba(255,255,255,0.1); }

        .card-content { padding: 2.5rem 2.5rem 2rem; margin-top: -70px; position: relative; z-index: 10; }
        .logo-section { display: flex; align-items: flex-end; gap: 2rem; margin-bottom: 2.5rem; }
        .logo { width: 120px; height: 120px; border-radius: 20px; background: var(--surface); border: 4px solid var(--surface); overflow: hidden; box-shadow: 0 15px 30px rgba(0,0,0,0.8); }
        .logo img { width: 100%; height: 100%; object-fit: cover; }
        
        .name { font-size: 1.6rem; font-weight: 900; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; }
        .verified { color: var(--accent); }
        .location { font-size: 0.75rem; color: var(--grey); font-weight: 800; text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem; }

        .studio-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2.5rem; padding: 1.5rem 0; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); }
        .metric { display: flex; flex-direction: column; gap: 0.3rem; }
        .metric span { font-size: 0.6rem; font-weight: 800; color: var(--grey); letter-spacing: 1px; }
        .metric strong { font-size: 1.1rem; font-weight: 900; color: white; }

        .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .full-width { justify-content: center; padding: 1rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }

        @media (max-width: 1024px) {
          .header { flex-direction: column; align-items: flex-start; gap: 2.5rem; }
          .search-bar { width: 100%; }
          .featured-studios { grid-template-columns: 1fr; height: auto; }
          .f-visual { height: 300px; }
        }
        .cursor-tap { cursor: url('https://api.iconify.design/material-symbols:touch-app-outline.svg?color=white&width=32&height=32'), auto !important; }
        .cursor-tap:hover { cursor: url('https://api.iconify.design/material-symbols:touch-app.svg?color=%23FF1B1C&width=32&height=32'), auto !important; }
      `}</style>
    </div>
  );
}
