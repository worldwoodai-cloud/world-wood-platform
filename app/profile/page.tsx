'use client';

import { motion } from 'framer-motion';
import { 
  UserCircle, 
  Settings, 
  Users, 
  Film, 
  LogOut, 
  Zap, 
  Award,
  ChevronRight,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, profile, signOut } = useAuth();
    const router = useRouter();
    const [followingStudios, setFollowingStudios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth');
            return;
        }

        const loadFollowing = () => {
            const followingIds = JSON.parse(localStorage.getItem('nexa-demo-following') || '[]');
            
            // Re-use demo studio data + current studio data to show followed list
            const demoStudios = [
                { id: 'demo-1', name: 'Neon Frontier Studios', verified: true, filmCount: 12, followers: '24.5k', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NFS&backgroundColor=8B0000', banner: 'https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&q=80&w=800' },
                { id: 'demo-2', name: 'Midnight Reel Co.', verified: true, filmCount: 8, followers: '18.2k', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MRC&backgroundColor=1a1a2e', banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800' },
                { id: 'demo-3', name: 'Aether Collective', verified: false, filmCount: 5, followers: '9.7k', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=4a1a8a', banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800' },
                { id: 'demo-4', name: 'Pulse Motion Pictures', verified: true, filmCount: 15, followers: '31.0k', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PMP&backgroundColor=cc0000', banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800' },
                { id: 'demo-5', name: 'Verdant Eye Films', verified: false, filmCount: 3, followers: '4.1k', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VEF&backgroundColor=0a5c36', banner: 'https://images.unsplash.com/photo-1518676590747-1e3dcf5a4e6f?auto=format&fit=crop&q=80&w=800' },
                { id: 'demo-6', name: 'Solaris Digital', verified: true, filmCount: 9, followers: '15.8k', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SD&backgroundColor=b8860b', banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800' },
            ];

            const localStudios = JSON.parse(localStorage.getItem('nexa-demo-studios') || '[]');
            const combined = [...demoStudios, ...localStudios];
            
            const filtered = combined.filter(s => followingIds.includes(s.id));
            setFollowingStudios(filtered);
            setLoading(false);
        };

        loadFollowing();
        
        // Listen for storage changes in case they unfollow in another tab
        window.addEventListener('storage', loadFollowing);
        return () => window.removeEventListener('storage', loadFollowing);
    }, [user, router]);

    const unfollow = (id: string) => {
        const followingIds = JSON.parse(localStorage.getItem('nexa-demo-following') || '[]');
        const updated = followingIds.filter((fid: string) => fid !== id);
        localStorage.setItem('nexa-demo-following', JSON.stringify(updated));
        setFollowingStudios(prev => prev.filter(s => s.id !== id));
    };

    if (loading) return null;

    return (
        <div className="profile-page">
            <Navbar />
            
            <div className="container">
                <header className="profile-header">
                    <div className="user-info">
                        <div className="avatar-wrap">
                            <div className="avatar">
                                {profile?.display_name?.charAt(0) || 'U'}
                            </div>
                            <div className="badge"><Zap size={10} fill="currentColor" /> Pro Citizen</div>
                        </div>
                        <div className="details">
                            <h1>{profile?.display_name || 'User'}</h1>
                            <p className="handle">@{profile?.display_name?.toLowerCase().replace(/\s+/g, '')} • Joined Feb 2026</p>
                            <div className="user-stats">
                                <div className="stat"><strong>{followingStudios.length}</strong> Following</div>
                                <div className="stat"><strong>0</strong> Collections</div>
                                <div className="stat"><strong>0</strong> Credits</div>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="btn-glass" onClick={() => router.push('/profile/edit')}><Settings size={18} /> Settings</button>
                        <button className="btn-secondary" onClick={() => { signOut(); router.push('/'); }}><LogOut size={18} /> Sign Out</button>
                    </div>
                </header>

                <main className="profile-content">
                    <div className="tabs">
                        <button className="tab-btn active">Following Studios</button>
                        <button className="tab-btn">My Collections</button>
                        <button className="tab-btn">Watch History</button>
                    </div>

                    <div className="content-area">
                        {followingStudios.length === 0 ? (
                            <div className="empty-state-tech glass">
                                <div className="icon-pulse">
                                    <Users size={40} className="accent-text" />
                                </div>
                                <h2 className="tech-title">ZERO_NODES_DETECTED</h2>
                                <p className="tech-desc">Initialize your cinematic frequency by following elite producers. Sync with the frontier of digital cinema.</p>
                                <button className="btn-primary-tech" onClick={() => router.push('/studios')}>
                                    <Zap size={16} /> SCAN_FOR_STUDIOS
                                </button>
                            </div>
                        ) : (
                            <div className="studio-grid-tech">
                                {followingStudios.map((studio, i) => (
                                    <motion.div 
                                        key={studio.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className="studio-node-card h-glass"
                                    >
                                        <div className="node-banner">
                                            <img src={studio.banner} alt="" />
                                            <div className="node-overlay"></div>
                                        </div>
                                        <div className="node-content">
                                            <div className="node-logo-shield">
                                                <img src={studio.logo} alt="" />
                                            </div>
                                            <div className="node-main-info">
                                                <h3 className="node-name">
                                                    {studio.name}
                                                    {studio.verified && <div className="verified-node"><Award size={10} /></div>}
                                                </h3>
                                                <div className="node-stats">
                                                    <span>{studio.followers} AUDIENCE</span>
                                                    <span className="dot"></span>
                                                    <span>{studio.filmCount} PREMIERES</span>
                                                </div>
                                            </div>
                                            <div className="node-actions-row">
                                                <button className="node-btn-view" onClick={() => router.push(`/studios/${studio.id}`)}>
                                                    SYNC_NODE
                                                </button>
                                                <button className="node-btn-unfollow" onClick={() => unfollow(studio.id)}>
                                                    UNLINK
                                                </button>
                                            </div>
                                        </div>
                                        <div className="node-decoration"></div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <style jsx>{`
                .profile-page { padding-top: 140px; min-height: 100vh; background: #050505; color: white; padding-bottom: 200px; }
                
                .profile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; }
                .user-info { display: flex; gap: 2.5rem; align-items: center; }
                .avatar-wrap { position: relative; }
                .avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--accent) 0%, #ff4d4d 100%); display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 900; border: 4px solid var(--surface); box-shadow: 0 10px 30px rgba(255, 27, 28, 0.2); }
                .badge { position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 50%); background: white; color: black; font-size: 0.6rem; font-weight: 950; padding: 0.3rem 0.8rem; border-radius: 40px; text-transform: uppercase; white-space: nowrap; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 0.3rem; }
                
                .details h1 { font-size: 2.5rem; font-weight: 950; margin-bottom: 0.2rem; letter-spacing: -1px; }
                .handle { color: var(--grey); font-weight: 700; font-size: 0.9rem; margin-bottom: 1rem; }
                .user-stats { display: flex; gap: 2rem; }
                .stat { font-size: 0.9rem; color: #ccc; font-weight: 600; }
                .stat strong { color: white; margin-right: 0.3rem; font-weight: 950; }

                .header-actions { display: flex; gap: 1rem; }

                .tabs { display: flex; gap: 2rem; border-bottom: 1px solid var(--glass-border); margin-bottom: 3rem; }
                .tab-btn { background: transparent; border: none; color: var(--grey); padding: 1rem 0; font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; position: relative; }
                .tab-btn.active { color: white; }
                .tab-btn.active::after { content: ""; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--accent); }

                /* Futuristic Grid & Empty State */
                .empty-state-tech { padding: 6rem; text-align: center; border-radius: 32px; background: rgba(255,255,255,0.02); }
                .icon-pulse { animation: pulse 2s infinite; margin-bottom: 1.5rem; opacity: 0.5; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 0.5; } }
                .tech-title { font-weight: 950; letter-spacing: 4px; font-size: 1.5rem; margin-bottom: 0.5rem; }
                .tech-desc { color: var(--grey); font-weight: 600; max-width: 450px; margin: 0 auto 2rem; line-height: 1.6; }
                .btn-primary-tech { background: var(--accent); color: white; border: none; padding: 1rem 2rem; font-weight: 950; letter-spacing: 2px; text-transform: uppercase; display: flex; align-items: center; gap: 1rem; margin: 0 auto; clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%); transition: 0.3s; }
                .btn-primary-tech:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,27,28,0.3); }

                .studio-grid-tech { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
                .studio-node-card { border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); position: relative; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .studio-node-card:hover { transform: translateY(-10px) scale(1.02); border-color: rgba(255,27,28,0.3); }
                
                .node-banner { height: 120px; position: relative; }
                .node-banner img { width: 100%; height: 100%; object-fit: cover; }
                .node-overlay { position: absolute; inset: 0; background: linear-gradient(transparent, #050505); }
                
                .node-content { padding: 0 2rem 2rem; position: relative; margin-top: -30px; }
                .node-logo-shield { width: 70px; height: 70px; border-radius: 16px; overflow: hidden; border: 3px solid #050505; background: #111; margin-bottom: 1.2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .node-logo-shield img { width: 100%; height: 100%; object-fit: cover; }
                
                .node-name { font-size: 1.25rem; font-weight: 950; display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.5rem; letter-spacing: -0.5px; }
                .verified-node { color: var(--accent); background: rgba(255,27,28,0.1); width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                .node-stats { display: flex; align-items: center; gap: 1rem; font-size: 0.65rem; font-weight: 900; color: var(--grey); letter-spacing: 1px; }
                .node-stats .dot { width: 3px; height: 3px; background: rgba(255,255,255,0.1); border-radius: 50%; }
                
                .node-actions-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem; }
                .node-btn-view { background: white; color: black; border: none; padding: 0.8rem; font-size: 0.7rem; font-weight: 950; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
                .node-btn-unfollow { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem; font-size: 0.7rem; font-weight: 950; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
                .node-btn-view:hover { background: var(--accent); color: white; }
                .node-btn-unfollow:hover { background: rgba(255,0,0,0.1); border-color: rgba(255,0,0,0.5); }
                
                .node-decoration { position: absolute; bottom: 0; left: 0; width: 0%; height: 2px; background: var(--accent); transition: 0.6s; }
                .studio-node-card:hover .node-decoration { width: 100%; }
            `}</style>
        </div>
    );
}
