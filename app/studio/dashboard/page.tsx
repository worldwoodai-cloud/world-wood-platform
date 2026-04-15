'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Film, Upload, BarChart3, Users, Settings, Plus, Play, Clock, CheckCircle, Video, X, Loader2, Globe, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { getSessionId } from '@/lib/demo-session';


const supabase = createClient();

export default function StudioDashboard() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [studio, setStudio] = useState<any>(null);
    const [films, setFilms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // ... rest of state stays same ...
    const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics' | 'comments' | 'community'>('overview');
    const [contentSubTab, setContentSubTab] = useState<'films' | 'shorts'>('shorts');
    const [shorts, setShorts] = useState<any[]>([]);

    // Feed / Shorts Modal State
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [trailerFile, setTrailerFile] = useState<File | null>(null);
    const [trailerThumbnail, setTrailerThumbnail] = useState<string | null>(null);
    const [trailerCaption, setTrailerCaption] = useState('');
    const [trailerUploading, setTrailerUploading] = useState(false);
    const [videoOrientation, setVideoOrientation] = useState<'landscape' | 'portrait' | null>(null);
    const [trailerDuration, setTrailerDuration] = useState<string>('0:00');

    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTrailerFile(file);
            const url = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = () => {
                setVideoOrientation(video.videoWidth > video.videoHeight ? 'landscape' : 'portrait');
                const dur = video.duration || 0;
                const m = Math.floor(dur / 60);
                const s = Math.floor(dur % 60);
                setTrailerDuration(`${m}:${s < 10 ? '0' : ''}${s}`);
                
                // Seek to a safer point for thumbnail to avoid black frames
                video.currentTime = Math.min(dur * 0.1, 0.8);
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                // Target a max width for thumbnails to save localStorage quota
                const targetWidth = 480;
                const scale = targetWidth / video.videoWidth;
                canvas.width = targetWidth;
                canvas.height = video.videoHeight * scale;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                // Reduce quality further to 0.4 for maximum space efficiency
                const thumbUrl = canvas.toDataURL('image/jpeg', 0.4);
                setTrailerThumbnail(thumbUrl);
                URL.revokeObjectURL(url);
            };

            video.src = url;
        } else {
            setTrailerFile(null);
            setTrailerThumbnail(null);
            setVideoOrientation(null);
        }
    };

    useEffect(() => {
        async function fetchStudioData() {
            if (!user) return;

            const isDemo = user?.id?.includes('demo');

            try {
                let currentStudio = null;
                let currentFilms = [];

                if (isDemo) {
                    // Fetch from local storage
                    const demoStudios = JSON.parse(localStorage.getItem('nexa-demo-studios') || '[]');
                    currentStudio = demoStudios.find((s: any) => s.id === user.id || s.owner_id === user.id);
                    
                    if (!currentStudio) {
                        setLoading(false);
                        window.location.href = '/studio/register';
                        return;
                    }

                    const demoFilms = JSON.parse(localStorage.getItem('nexa-demo-films') || '[]');
                    currentFilms = demoFilms.filter((f: any) => f.studio_id === user.id);
                    
                    setStudio(currentStudio);
                    setFilms(currentFilms);
                } else {
                    // Fetch from Supabase
                    const { data: studioData, error: studioError } = await supabase
                        .from('studios')
                        .select('*')
                        .eq('owner_id', user.id)
                        .single();

                    if (studioError && studioError.code === 'PGRST116') {
                        setLoading(false);
                        window.location.href = '/studio/register';
                        return;
                    } 
                    
                    currentStudio = studioData;
                    setStudio(studioData);

                    if (studioData?.id) {
                        const { data: filmsData } = await supabase
                            .from('films')
                            .select('*')
                            .eq('studio_id', studioData.id)
                            .order('created_at', { ascending: false });
                        
                        currentFilms = filmsData || [];
                        setFilms(currentFilms);
                    }
                }

                // Load shorts (demo and real)
                const storedShorts = JSON.parse(localStorage.getItem(`nexa-shorts-${getSessionId()}`) || '[]');
                setShorts(storedShorts);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            if (!user) {
                router.push('/auth');
            } else {
                fetchStudioData();
            }
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="studio-loading">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="loading-content"
                >
                    <div className="spinner-box">
                        <Loader2 size={48} className="spin accent-text" />
                        <div className="pulse-ring"></div>
                    </div>
                    <h2>Initializing Producer Workspace</h2>
                    <p>Fetching your films and cinema assets...</p>
                </motion.div>
                <style jsx>{`
                    .studio-loading {
                        min-height: 100vh;
                        background: #050505;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    }
                    .spinner-box { position: relative; width: fit-content; margin: 0 auto 2rem; }
                    .pulse-ring {
                        position: absolute;
                        inset: -10px;
                        border: 2px solid var(--accent);
                        border-radius: 50%;
                        animation: pulse-ring 2s infinite;
                        opacity: 0;
                    }
                    @keyframes pulse-ring {
                        0% { transform: scale(0.8); opacity: 0; }
                        50% { opacity: 0.5; }
                        100% { transform: scale(1.5); opacity: 0; }
                    }
                    h2 { font-size: 1.5rem; font-weight: 950; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem; }
                    p { color: var(--grey); font-size: 0.9rem; }
                    .spin { animation: spin 1s linear infinite; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }
    if (!user) return null;


    const stats = [
        { label: 'Total Films', value: films.length.toString(), icon: <Film size={20} />, trend: '+2 films this season' },
        { label: 'DCSB Verified', value: films.filter(f => f.status === 'approved').length.toString(), icon: <CheckCircle size={20} />, trend: 'Audit Score: 98.4%' },
        { label: 'Global Audience', value: (films.length * 1234 + 678).toLocaleString(), icon: <Users size={20} />, trend: 'Rising in Tokyo Grid' },
        { label: 'Est. Revenue', value: `$${(films.filter(f => f.status === 'approved').length * 1240 + 85).toLocaleString()}`, icon: <BarChart3 size={20} />, trend: 'Pay-per-view Tier 1' },
    ];



    return (
        <div className="studio-workspace">
            <div className="container">
                <header className="workspace-header">
                    <div className="creator-info">
                        <div className="avatar-large">{studio?.name?.charAt(0) || profile?.display_name?.charAt(0)}</div>
                        <div>
                            <h1>{studio?.name || profile?.display_name} <span className="badge">Studio</span></h1>
                            <p>{studio?.description || 'Welcome to your World Wood Producer Workspace. Manage your premieres and cinema assets.'}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-glass" onClick={() => {
                            if(confirm("Strict Practical Alert: This will clear all local demo posts and reset your workspace storage quota. Continue?")) {
                                localStorage.removeItem('nexa-demo-feed-posts');
                                localStorage.removeItem('nexa-demo-shorts-posts');
                                localStorage.removeItem('nexa-demo-films');
                                window.location.reload();
                            }
                        }} title="Clear Workspace Storage"><Globe size={18} /></button>
                        <button className="btn-glass" onClick={() => setIsTrailerModalOpen(true)}><Video size={18} /> New Post</button>
                        <button className="btn-primary" onClick={() => router.push('/studio/upload')}><Plus size={18} /> New Film Submission</button>
                    </div>
                </header>

                <div className="dashboard-tabs">
                    <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Content</button>
                    <button className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}>Community</button>
                    <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
                    <button className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>Comments</button>
                </div>

                {activeTab === 'overview' && (
                    <div className="overview-layout">
                        <div className="main-col">
                            <div className="stats-grid">
                                {stats.map((s, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="stat-card glass-glow"
                                    >
                                        <div className="s-icon">{s.icon}</div>
                                        <div className="s-meta">
                                            <span className="s-label">{s.label}</span>
                                            <span className="s-value">{s.value}</span>
                                            <span className="s-trend accent-text-dim">{s.trend}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <section className="submission-guide glass">
                                <div className="guide-content">
                                    <Upload size={48} className="accent-text" />
                                    <div className="text-col">
                                        <h3>Submit to DCSB Board</h3>
                                        <p>Your current film status is tracking <strong>Excellent</strong>. Consider submitting your next premiere for the 2026 Spring Festival cycle.</p>
                                    </div>
                                    <button className="btn-primary" onClick={() => router.push('/studio/upload')}>Launch Submission Portal</button>
                                </div>
                            </section>

                             <div className="content-rows">
                                <section className="performance-summary glass-glow">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3>Audience Retention Alpha</h3>
                                        <div className="live-status"><div className="ping"></div> LIVE INTEL</div>
                                    </div>
                                    <div className="mini-charts">
                                        <div className="m-chart">
                                            <span>Content Saturation</span>
                                            <div className="m-bar-bg"><div className="m-bar-fill" style={{ width: '78%' }}></div></div>
                                        </div>
                                        <div className="m-chart">
                                            <span>Engagement Depth</span>
                                            <div className="m-bar-bg"><div className="m-bar-fill" style={{ width: '45%', background: 'var(--accent)' }}></div></div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <aside className="activity-sidebar glass">
                            <h3>Workspace Activity</h3>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <div className="a-icon pulse-green"></div>
                                    <div className="a-text">
                                        <p><strong>DCSB Approved</strong> "Circuit Stories"</p>
                                        <span>2 hours ago</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="a-icon"></div>
                                    <div className="a-text">
                                        <p>New comment from <strong>Alex_Riv</strong></p>
                                        <span>5 hours ago</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="a-icon"></div>
                                    <div className="a-text">
                                        <p>System Update: V2.4 Identity Audit Tooling</p>
                                        <span>Yesterday</span>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-glass full-width" style={{ marginTop: 'auto' }}>View Full Audit Log</button>
                        </aside>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <section className="analytics-section">
                        <div className="section-header">
                            <h2>Audience Intelligence</h2>
                            <div className="time-select glass">Last 30 Days</div>
                        </div>
                        <div className="analytics-grid">
                            <div className="chart-box glass">
                                <div className="chart-header">
                                    <span className="label">ENGAGEMENT HEATMAP</span>
                                    <span className="value">+12.4% VS PREVIOUS</span>
                                </div>
                                <div className="mock-chart">
                                    {[...Array(24)].map((_, i) => (
                                        <div key={i} className="bar" style={{ height: `${20 + Math.random() * 80}%`, background: `rgba(255,27,28, ${0.2 + (i / 24) * 0.8})` }}></div>
                                    ))}
                                </div>
                                <div className="chart-footer">Peak viewership: 09:00 PM - 11:30 PM (UTC)</div>

                                <div className="engagement-insights">
                                    <div className="insight">
                                        <Clock size={14} className="accent-text" />
                                        <span>Average Watch Time: <strong>14m 22s</strong> (Above Sector Avg)</span>
                                    </div>
                                    <div className="insight">
                                        <Users size={14} className="accent-text" />
                                        <span>Peak concurrent: <strong>3.2K Premiere Day</strong></span>
                                    </div>
                                </div>
                            </div>

                            <div className="side-metrics">
                                <div className="metric-box glass">
                                    <div className="mini-metric">
                                        <span className="label">AUDIENCE RETENTION</span>
                                        <span className="value">84%</span>
                                        <div className="progress-bg"><div className="progress-fill" style={{ width: '84%' }}></div></div>
                                    </div>
                                    <div className="mini-metric">
                                        <span className="label">PREMIERE CONVERSION</span>
                                        <span className="value">32%</span>
                                        <div className="progress-bg"><div className="progress-fill" style={{ width: '32%', background: '#00c2ff' }}></div></div>
                                    </div>
                                </div>

                                <div className="geography-box glass">
                                    <span className="label">TOP VIEWING REGIONS</span>
                                    <ul className="geo-list">
                                        <li><span>New Tokyo Metro</span> <span>42%</span></li>
                                        <li><span>London Grid</span> <span>18%</span></li>
                                        <li><span>San Francisco Nexus</span> <span>12%</span></li>
                                        <li><span>Other</span> <span>28%</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'content' && (
                    <section className="content-section glass" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>Channel content</h2>

                        <div className="content-subtabs" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
                            <button className={`subtab-btn ${contentSubTab === 'films' ? 'active' : ''}`} onClick={() => setContentSubTab('films')}>Films & Submissions</button>
                            <button className={`subtab-btn ${contentSubTab === 'shorts' ? 'active' : ''}`} onClick={() => setContentSubTab('shorts')}>Shorts</button>
                        </div>

                        {contentSubTab === 'shorts' && (
                            <div className="content-table" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                <div className="c-table-header" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr 1.5fr', padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontSize: '0.8rem', color: 'var(--grey)', fontWeight: 'bold' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><input type="checkbox" className="custom-checkbox" /> Short</div>
                                    <div>Visibility</div>
                                    <div>Restrictions</div>
                                    <div>Date</div>
                                    <div>Views</div>
                                    <div>Comments</div>
                                    <div>Likes (vs dislikes)</div>
                                </div>

                                {shorts.map((s, i) => (
                                    <div key={i} className="c-table-row" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr 1.5fr', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', transition: 'background 0.2s' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <input type="checkbox" className="custom-checkbox" style={{ marginTop: '0.5rem' }} />
                                            <div style={{ position: 'relative', width: '60px', height: '100px', borderRadius: '4px', overflow: 'hidden', background: '#222', flexShrink: 0 }}>
                                                <img src={s.thumbnail || '/scifi-hall.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '2px', fontFamily: 'monospace' }}>{s.duration || '0:15'}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingRight: '1rem' }}>
                                                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.title}</h4>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--grey)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>{s.description || 'No description provided.'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}><Globe size={14} style={{ color: 'var(--grey)' }} /> Public</div>
                                        <div style={{ fontSize: '0.85rem' }}>None</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                                            <span>{s.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--grey)' }}>Published</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem' }}>{s.views || '0'}</div>
                                        <div style={{ fontSize: '0.85rem' }}>{s.comments || '0'}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                                            <span>{s.likeRatio || 100.0}%</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--grey)', margin: '0.2rem 0 0.4rem 0' }}>{s.likes || 0} likes</span>
                                            <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', width: '100px', borderRadius: '2px', overflow: 'hidden' }}><div style={{ height: '100%', background: 'var(--accent)', width: `${s.likeRatio || 100}%` }}></div></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {contentSubTab === 'films' && (
                            <div className="films-table" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1rem' }}>
                                <div className="table-header" style={{ padding: '0 0 1rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                                    <span>Film Title</span>
                                    <span>DCSB Status</span>
                                    <span>Engagement</span>
                                    <span>Premiere Date</span>
                                    <span>Actions</span>
                                </div>
                                {films.length === 0 ? (
                                    <div className="empty-state">
                                        <p>You haven't uploaded any films yet.</p>
                                        <button className="btn-glass" onClick={() => router.push('/studio/upload')}>Upload Your First Film</button>
                                    </div>
                                ) : films.map((f, i) => (
                                    <div key={i} className="table-row" style={{ padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span className="f-title">{f.title}</span>
                                        <span className={`f-status ${f.status.toLowerCase().replace(/\s+/g, '-')}`}>{f.status}</span>
                                        <span className="f-views">{(1200 + i * 450).toLocaleString()} Views</span>
                                        <span className="f-date">{new Date(f.created_at).toLocaleDateString()}</span>
                                        <span className="f-actions">
                                            <button className="action-link" onClick={() => router.push(`/studio/edit/${f.id}`)}>Edit</button>
                                            <button className="action-link" onClick={() => { setActiveTab('analytics'); setTimeout(() => alert(`Loading analytics for: ${f.title}`), 100); }}>Analytics</button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'comments' && (
                    <section className="films-section glass">
                        <div className="section-header" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Community Intelligence</h2>
                        </div>
                        <div className="comment-feed">
                            <div className="comment-item">
                                <div className="c-avatar">A</div>
                                <div className="c-content">
                                    <div className="c-header">
                                        <strong>Alex_Riv</strong> <span>on Circuit Stories • 2h ago</span>
                                    </div>
                                    <p>"The use of synthetic textures in the third act is genuinely revolutionary. I've never seen AI skin shaders look this realistic."</p>
                                    <div className="c-actions">
                                        <button>Reply</button>
                                        <button>Moderate</button>
                                        <button>Feature Top</button>
                                    </div>
                                </div>
                            </div>
                            <div className="comment-item">
                                <div className="c-avatar">L</div>
                                <div className="c-content">
                                    <div className="c-header">
                                        <strong>Luna_Wei</strong> <span>on Neural Drift • 5h ago</span>
                                    </div>
                                    <p>"Is there a behind-the-scenes? I'd love to know which diffusion model was used for the set extensions."</p>
                                    <div className="c-actions">
                                        <button>Reply</button>
                                        <button>Moderate</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'community' && (
                    <section className="community-section glass" style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1px' }}>CITIZEN_<span className="accent-text">NETWORK</span></h1>
                                <p style={{ color: 'var(--grey)', fontSize: '1rem', fontWeight: 600 }}>Manage your studio's elite audience and gathered neural frequencies.</p>
                            </div>
                            <div className="total-fans-shield">
                                <Users size={20} className="accent-text" /> 
                                <div className="shield-info">
                                    <span className="count">{studio?.followers || '0'}</span>
                                    <span className="label">ACTIVE_NODES</span>
                                </div>
                            </div>
                        </div>

                        <div className="citizen-grid">
                            {[
                                { name: 'Dr. Neural', role: 'ELITE_CRITIC', followers: '12k', joined: '2 days ago', level: 94 },
                                { name: 'Spatial Queen', role: 'TOP_CONTRIBUTOR', followers: '45k', joined: '1 week ago', level: 88 },
                                { name: 'Pixel Pioneer', role: 'COMMUNITY_MOD', followers: '2.1k', joined: 'Jan 2026', level: 76 },
                                { name: 'Cyber Cineaste', role: 'VERIFIED_WATCHER', followers: '840', joined: 'Feb 2026', level: 42 }
                            ].map((fan, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="citizen-card glass-glow-white"
                                >
                                    <div className="card-scan-line"></div>
                                    <div className="citizen-avatar-hex">
                                        <div className="hex-inner">
                                            <span>{fan.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="citizen-info">
                                        <div className="citizen-header">
                                            <h4 className="citizen-name">{fan.name}</h4>
                                            <span className="citizen-role-badge">{fan.role}</span>
                                        </div>
                                        <div className="citizen-stats-row">
                                            <span>{fan.followers} FANS</span>
                                            <span className="dot"></span>
                                            <span>LEVEL {fan.level}</span>
                                        </div>
                                        <div className="level-p-bar">
                                            <div className="p-fill" style={{ width: `${fan.level}%` }}></div>
                                        </div>
                                    </div>
                                    <button className="citizen-unlink-btn" title="Revoke Access"><X size={14} /></button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="premiere-nexus-cta glass">
                            <div className="nexus-glow"></div>
                            <Sparkles size={40} className="accent-text" style={{ marginBottom: '1.5rem' }} />
                            <h3 className="nexus-title">HOST_PRIVATE_SCREENING</h3>
                            <p className="nexus-desc">Invite your top-tier nodes to a restricted premiere. Harvest neural feedback and synchronize your distribution frequency before global launch.</p>
                            <button className="btn-primary-tech-large">
                                <Zap size={18} /> INITIALIZE_PRIVATE_PREMIERE
                            </button>
                        </div>
                    </section>
                )}
            </div>

            {/* Trailer Quick Post Modal */}
            <AnimatePresence>
                {isTrailerModalOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            className="modal-content glass"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <div className="modal-header">
                                <h3>Create Post</h3>
                                <button className="close-btn" onClick={() => setIsTrailerModalOpen(false)}><X size={20} /></button>
                            </div>

                            <div className="modal-body">
                                <div className="upload-dropzone">
                                    <Video size={48} className="accent-text" />
                                    <h4>Upload Video</h4>
                                    <p>Portrait goes to Shorts • Landscape goes to Feed</p>
                                    <input type="file" accept="video/mp4,video/quicktime" onChange={handleFileSelection} hidden id="trailer-upload" />
                                    <label htmlFor="trailer-upload" className="btn-glass">{trailerFile ? trailerFile.name : 'Select File'}</label>
                                    {videoOrientation === 'landscape' && <span className="badge" style={{ marginTop: '0.5rem', background: 'rgba(0,194,255,0.1)', color: '#00c2ff', border: '1px solid #00c2ff', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Detected: Landscape (goes to Feed)</span>}
                                    {videoOrientation === 'portrait' && <span className="badge" style={{ marginTop: '0.5rem', background: 'rgba(255,172,7,0.1)', color: '#ffac07', border: '1px solid #ffac07', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Detected: Portrait (goes to Shorts)</span>}
                                </div>

                                <div className="input-group">
                                    <label>Caption & Hashtags</label>
                                    <textarea
                                        placeholder="Introduce your post... #WorldWood #Premiere"
                                        rows={3}
                                        value={trailerCaption}
                                        onChange={(e) => setTrailerCaption(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-glass" onClick={() => setIsTrailerModalOpen(false)}>Cancel</button>
                                <button
                                    className="btn-primary"
                                    disabled={!trailerFile || trailerUploading}
                                    onClick={async () => {
                                        setTrailerUploading(true);
                                        try {
                                            const isLandscape = videoOrientation === 'landscape';
                                            const storageKey = isLandscape ? 'nexa-demo-feed-posts' : 'nexa-demo-shorts-posts';
                                            
                                            let finalVideoUrl = '';
                                            let finalThumbUrl = '';

                                            // 1. SUPABASE STORAGE UPLOAD (ACTUAL INTEGRATION)
                                            if (trailerFile) {
                                                const fileExt = trailerFile.name.split('.').pop();
                                                const fileName = `${Date.now()}.${fileExt}`;
                                                const filePath = `trailers/${fileName}`;

                                                const { data: uploadData, error: uploadError } = await supabase.storage
                                                    .from('films')
                                                    .upload(filePath, trailerFile);

                                                if (!uploadError && uploadData) {
                                                    const { data: { publicUrl } } = supabase.storage
                                                        .from('films')
                                                        .getPublicUrl(filePath);
                                                    finalVideoUrl = publicUrl;
                                                }

                                                // Upload Thumbnail if available
                                                if (trailerThumbnail) {
                                                    const thumbBlob = await (await fetch(trailerThumbnail)).blob();
                                                    const thumbPath = `thumbnails/${Date.now()}.jpg`;
                                                    const { data: tData, error: tErr } = await supabase.storage
                                                        .from('films')
                                                        .upload(thumbPath, thumbBlob);
                                                    
                                                    if (!tErr) {
                                                        const { data: { publicUrl } } = supabase.storage
                                                            .from('films')
                                                            .getPublicUrl(thumbPath);
                                                        finalThumbUrl = publicUrl;
                                                    }
                                                }
                                            }

                                            // Fallback to local Blob if Supabase fails/not configured
                                            const videoBlobUrl = finalVideoUrl || (trailerFile ? URL.createObjectURL(trailerFile) : '');
                                            const thumbUrl = finalThumbUrl || trailerThumbnail || '/scifi-hall.png';
                                            // 2. SUPABASE DB INSERT
                                            // Only attempt if we have a real studio (not a demo studio ID)
                                            const isDemoStudio = studio?.id?.toString().startsWith('demo-') || !finalVideoUrl.includes('supabase.co');
                                            
                                            if (studio?.id && !isDemoStudio) {
                                                const title = trailerCaption.split('#')[0].trim() || 'New Upload ' + Date.now();
                                                const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                                                
                                                try {
                                                    const { error: dbError } = await supabase.from('films').insert([{
                                                        studio_id: studio.id,
                                                        title: title,
                                                        slug: slug + '-' + Math.random().toString(36).substring(2, 7),
                                                        video_url: videoBlobUrl,
                                                        poster_url: thumbUrl,
                                                        trailer_url: videoBlobUrl,
                                                        description: trailerCaption,
                                                        status: 'pending'
                                                    }]);
                                                    
                                                    if (dbError) {
                                                        console.error('DB Insert failed:', dbError);
                                                    }
                                                } catch (insertErr) {
                                                    console.error('Critical insert execution error:', insertErr);
                                                }
                                            } else {
                                                console.log('Skipping Supabase DB insert (Demo Mode Active)');
                                            }

                                            // 3. Keep local storage for instant demo feedback
                                            // Fallback: Don't store large blob URLs in local storage permanently as they expire and clog memory
                                            const newPost = isLandscape ? {
                                                id: 'user-post-' + Date.now(),
                                                title: trailerCaption.split('#')[0].trim() || 'New Trailer',
                                                thumbnail: thumbUrl,
                                                videoUrl: videoBlobUrl,
                                                studio: studio?.name || profile?.display_name || 'My Studio',
                                                studioAvatar: (studio?.name || profile?.display_name || 'M').charAt(0),
                                                timeAgo: 'Just now',
                                                duration: trailerDuration,
                                                likes: '0',
                                                hall: 'Sci-Fi & Future',
                                                category: 'Sci-Fi',
                                                is_premiere: true,
                                                isAd: false
                                            } : {
                                                id: 'user-short-' + Date.now(),
                                                title: trailerCaption.split('#')[0].trim() || 'New Short',
                                                studio: studio?.name || profile?.display_name || 'My Studio',
                                                studioAvatar: (studio?.name || profile?.display_name || 'M').charAt(0),
                                                thumbnail: thumbUrl,
                                                videoUrl: videoBlobUrl,
                                                likes: '0',
                                                comments: '0',
                                                shares: '0',
                                                views: '0',
                                                description: trailerCaption,
                                                hall: 'Sci-Fi & Future',
                                                hallSlug: 'scifi',
                                                sound: 'Original Audio',
                                                isAd: false
                                            };

                                            const storageSafePost = {
                                                ...newPost,
                                                sessionId: getSessionId(),
                                                // If it's a blob URL, we mark it as temporary. Persistent storage should wait for Supabase.
                                                videoUrl: videoBlobUrl.startsWith('blob:') ? `temp-blob|${videoBlobUrl}` : videoBlobUrl
                                            };

                                            const existingPosts = JSON.parse(localStorage.getItem(storageKey) || '[]');
                                            existingPosts.unshift(storageSafePost);
                                            
                                            // Limit to last 10 demo posts to avoid quota issues
                                            const limitedPosts = existingPosts.slice(0, 10);
                                                                                try {
                                                localStorage.setItem(storageKey, JSON.stringify(limitedPosts));
                                            } catch (err: any) {
                                                if (err.name === 'QuotaExceededError' || err.code === 22) {
                                                    console.warn("Storage quota exceeded, trying aggressive prune...");
                                                    try {
                                                        // Stage 2: Try 3 posts
                                                        localStorage.setItem(storageKey, JSON.stringify(existingPosts.slice(0, 3)));
                                                    } catch (err2) {
                                                        console.warn("Quota still exceeded, trying atomic post save...");
                                                        try {
                                                            // Stage 3: Try ONLY the new post
                                                            localStorage.setItem(storageKey, JSON.stringify([storageSafePost]));
                                                        } catch (err3) {
                                                            console.error("Storage Critical: Local quota completely exhausted by other keys.");
                                                            alert("CITIZEN ALERT: Your browser's storage quota is completely full. Please use the 'Clear Workspace Storage' (Globe) icon in the header to free up space for new posts.");
                                                        }
                                                    }
                                                } else {
                                                    throw err;
                                                }
                                            }

                                            setIsTrailerModalOpen(false);
                                            setTrailerFile(null);
                                            setTrailerThumbnail(null);
                                            setTrailerCaption('');
                                            setTrailerUploading(false);
                                            router.refresh();
                                        } catch (err: any) {
                                            alert("Publishing Failed: " + err.message);
                                            setTrailerUploading(false);
                                        }
                                    }}
                                >
                                    {trailerUploading ? <Loader2 className="animate-spin" size={18} /> : 'Publish Now'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .overview-layout { display: grid; grid-template-columns: 1fr 300px; gap: 2.5rem; }
        .activity-sidebar { padding: 2.5rem; border-radius: 16px; display: flex; flex-direction: column; gap: 2rem; height: fit-content; }
        .activity-sidebar h3 { font-size: 0.9rem; text-transform: uppercase; color: var(--grey); letter-spacing: 1px; }
        .activity-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .activity-item { display: flex; gap: 1rem; align-items: flex-start; }
        .a-icon { width: 10px; height: 10px; border-radius: 50%; background: var(--glass-border); margin-top: 6px; }
        .a-icon.pulse-green { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
        .a-text p { font-size: 0.9rem; margin-bottom: 0.2rem; line-height: 1.3; }
        .a-text span { font-size: 0.75rem; color: var(--grey); }

        .performance-summary { padding: 2rem; border-radius: 16px; margin-top: 2.5rem; }
        .performance-summary h3 { font-size: 1rem; margin-bottom: 1.5rem; }
        .mini-charts { display: flex; gap: 3rem; }
        .m-chart { flex: 1; }
        .m-chart span { font-size: 0.7rem; color: var(--grey); text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
        .m-bar-bg { height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .m-bar-fill { height: 100%; background: var(--accent); }

        .engagement-insights { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--glass-border); }
        .insight { display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: var(--grey); }
        .insight strong { color: white; }

        .side-metrics { display: flex; flex-direction: column; gap: 2rem; }
        .geography-box { padding: 2rem; border-radius: 16px; }
        .geography-box .label { font-size: 0.75rem; font-weight: 800; color: var(--grey); margin-bottom: 1.5rem; display: block; }
        .geo-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .geo-list li { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #ccc; }
        .geo-list li span:last-child { color: white; border-bottom: 1px solid var(--accent); }

        .comment-feed { display: flex; flex-direction: column; }
        .comment-item { display: flex; gap: 1.5rem; padding: 2rem; border-bottom: 1px solid var(--glass-border); }
        .comment-item:last-child { border-bottom: none; }
        .c-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--surface); display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .c-header { margin-bottom: 0.5rem; font-size: 0.9rem; }
        .c-header span { color: var(--grey); margin-left: 0.5rem; font-size: 0.8rem; }
        .c-content p { color: #ccc; line-height: 1.5; margin-bottom: 1rem; }
        .c-actions { display: flex; gap: 1.5rem; }
        .c-actions button { background: none; border: none; color: var(--accent); font-size: 0.75rem; font-weight: 800; cursor: pointer; text-transform: uppercase; }
        .c-actions button:hover { color: white; }

        .studio-workspace { padding-top: 154px; padding-bottom: 100px; }
        .workspace-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .creator-info { display: flex; align-items: center; gap: 2rem; }
        .avatar-large { width: 80px; height: 80px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; }
        .workspace-header h1 { font-size: 2.5rem; font-weight: 950; display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
        .badge { background: rgba(255,255,255,0.1); font-size: 0.7rem; padding: 0.3rem 0.6rem; border-radius: 4px; color: var(--grey); vertical-align: middle; }
        .workspace-header p { color: var(--grey); font-size: 1.1rem; }

        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-card { padding: 1.5rem 2rem; border-radius: 12px; display: flex; align-items: center; gap: 1.5rem; }
        .s-icon { color: var(--accent); }
        .s-label { display: block; font-size: 0.65rem; font-weight: 800; color: var(--grey); text-transform: uppercase; margin-bottom: 0.2rem; }
        .s-value { font-size: 1.4rem; font-weight: 900; }

        .films-section { margin-bottom: 5rem; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        
        .films-table { border-radius: 12px; overflow: hidden; }
        .dashboard-tabs { display: flex; gap: 2rem; margin-bottom: 3rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
        .tab-btn { background: none; border: none; font-size: 0.9rem; font-weight: 800; color: var(--grey); cursor: pointer; position: relative; padding: 0.5rem 1rem; transition: var(--transition); }
        .tab-btn:hover { color: white; }
        .tab-btn.active { color: white; }
        .tab-btn.active::after { content: ''; position: absolute; bottom: -17px; left: 0; right: 0; height: 3px; background: var(--accent); border-radius: 3px 3px 0 0; }
        .table-row { padding: 1.2rem 2rem; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; align-items: center; border-bottom: 1px solid var(--glass-border); transition: var(--transition); }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        .table-header { padding: 1rem 2rem; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--grey); letter-spacing: 1px; border-bottom: 1px solid var(--glass-border); opacity: 0.6; }
        
        .f-title { font-weight: 800; font-size: 1rem; }
        .f-status { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; border-radius: 3px; padding: 2px 6px; width: fit-content; }
        .f-status.approved { background: rgba(0, 194, 255, 0.1); color: #00c2ff; border: 1px solid rgba(0, 194, 255, 0.2); }
        .f-status.pending { background: rgba(255, 172, 7, 0.1); color: #ffac07; border: 1px solid rgba(255, 172, 7, 0.2); }
        .f-views { font-size: 0.85rem; font-weight: 700; color: #aaa; }
        .f-date { font-size: 0.85rem; color: var(--grey); }
        .f-actions { display: flex; gap: 1rem; }
        
        .action-link { font-size: 0.75rem; font-weight: 800; color: var(--grey); text-transform: uppercase; letter-spacing: 0.5px; }
        .action-link:hover { color: white; }

        .submission-guide { padding: 3rem; border-radius: 16px; margin-bottom: 2.5rem; }
        .guide-content { display: flex; align-items: center; gap: 2.5rem; }
        .text-col h3 { font-size: 1.3rem; font-weight: 900; margin-bottom: 0.4rem; }
        .text-col p { color: var(--grey); font-size: 0.95rem; max-width: 500px; line-height: 1.5; }
        .empty-state { padding: 4rem; text-align: center; color: var(--grey); }
        .empty-state p { margin-bottom: 2rem; }

        .analytics-section { margin-bottom: 5rem; }
        .time-select { padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; }
        .analytics-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2.5rem; }
        .chart-box { padding: 2.5rem; border-radius: 16px; position: relative; }
        .chart-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
        .chart-header .label { font-size: 0.7rem; font-weight: 800; color: var(--grey); letter-spacing: 1.5px; }
        .chart-header .value { font-size: 0.7rem; font-weight: 900; color: #00ff88; }
        .mock-chart { height: 180px; display: flex; align-items: flex-end; gap: 0.4rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem; }
        .bar { flex: 1; border-radius: 2px 2px 0 0; }
        .chart-footer { font-size: 0.65rem; color: var(--grey); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        .metric-box { padding: 2rem; border-radius: 16px; display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2.5rem; }
        .mini-metric .label { font-size: 0.65rem; font-weight: 800; color: var(--grey); display: block; margin-bottom: 0.6rem; letter-spacing: 1px; }
        .mini-metric .value { font-size: 1.6rem; font-weight: 950; margin-bottom: 1rem; display: block; }
        .progress-bg { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }

        /* Citizen Network & Community Styles */
        .total-fans-shield { display: flex; align-items: center; gap: 1.5rem; background: rgba(255,27,28,0.05); padding: 1rem 2rem; border: 1px solid rgba(255,27,28,0.2); border-radius: 20px; }
        .shield-info { display: flex; flexDirection: column; }
        .shield-info .count { font-size: 1.5rem; font-weight: 950; line-height: 1; }
        .shield-info .label { font-size: 0.6rem; font-weight: 800; color: var(--grey); letter-spacing: 2px; }

        .citizen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
        .citizen-card { 
            background: rgba(255,255,255,0.03); 
            border: 1px solid rgba(255,255,255,0.05); 
            border-radius: 24px; 
            padding: 1.5rem; 
            display: flex; 
            gap: 1.5rem; 
            align-items: center; 
            position: relative; 
            overflow: hidden;
            transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .citizen-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
        .card-scan-line { position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: linear-gradient(90deg, transparent, white, transparent); opacity: 0; transition: 0.5s; }
        .citizen-card:hover .card-scan-line { opacity: 0.2; animation: scan-v 2s linear infinite; }
        @keyframes scan-v { from { top: 0; } to { top: 100%; } }

        .citizen-avatar-hex { 
            width: 60px; height: 60px; background: var(--accent); 
            clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
            display: flex; align-items: center; justify-content: center;
            padding: 2px;
        }
        .hex-inner { 
            width: 100%; height: 100%; background: #050505; 
            clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.5rem; font-weight: 950;
        }

        .citizen-info { flex: 1; }
        .citizen-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
        .citizen-name { font-size: 1rem; font-weight: 900; }
        .citizen-role-badge { font-size: 0.55rem; font-weight: 950; color: var(--accent); background: rgba(255,27,28,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; letter-spacing: 1px; }
        
        .citizen-stats-row { display: flex; align-items: center; gap: 0.8rem; font-size: 0.65rem; color: var(--grey); font-weight: 800; margin-bottom: 0.6rem; }
        .citizen-stats-row .dot { width: 3px; height: 3px; background: rgba(255,255,255,0.1); border-radius: 50%; }
        
        .level-p-bar { height: 3px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .level-p-bar .p-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #ff4d4d); }
        
        .citizen-unlink-btn { background: transparent; border: none; color: var(--grey); opacity: 0; transition: 0.3s; cursor: pointer; }
        .citizen-card:hover .citizen-unlink-btn { opacity: 0.5; }
        .citizen-unlink-btn:hover { color: var(--accent); opacity: 1; }

        .premiere-nexus-cta { 
            margin-top: 4rem; padding: 5rem; text-align: center; border-radius: 40px; 
            position: relative; overflow: hidden; border: 1px solid rgba(255,27,28,0.1);
        }
        .nexus-glow { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(255,27,28,0.08) 0%, transparent 70%); }
        .nexus-title { font-size: 2rem; font-weight: 950; letter-spacing: 4px; margin-bottom: 1rem; }
        .nexus-desc { color: var(--grey); font-size: 1.1rem; max-width: 600px; margin: 0 auto 3rem; line-height: 1.6; font-weight: 600; }
        .btn-primary-tech-large { 
            background: white; color: black; border: none; padding: 1.2rem 3rem; 
            font-size: 0.9rem; font-weight: 950; letter-spacing: 3px; text-transform: uppercase;
            clip-path: polygon(0 0, 100% 0, 100% 70%, 95% 100%, 0 100%);
            transition: 0.3s; cursor: pointer; display: flex; align-items: center; gap: 1.5rem; margin: 0 auto;
        }
        .btn-primary-tech-large:hover { background: var(--accent); color: white; transform: scale(1.05); box-shadow: 0 20px 40px rgba(255,27,28,0.3); }
        .progress-fill { height: 100%; background: var(--accent); border-radius: 10px; }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { width: 100%; max-width: 500px; padding: 2.5rem; border-radius: 20px; display: flex; flex-direction: column; gap: 2rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 1.5rem; font-weight: 900; }
        .close-btn { background: none; border: none; color: var(--grey); cursor: pointer; transition: color 0.2s; }
        .close-btn:hover { color: white; }
        
        .upload-dropzone { border: 2px dashed rgba(255,255,255,0.1); border-radius: 12px; padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; background: rgba(0,0,0,0.2); transition: var(--transition); }
        .upload-dropzone:hover { border-color: var(--accent); background: rgba(255, 27, 28, 0.05); }
        .upload-dropzone h4 { font-size: 1.1rem; font-weight: 800; margin-bottom: -0.5rem; }
        .upload-dropzone p { color: var(--grey); font-size: 0.85rem; margin-bottom: 0.5rem; }
        
        .input-group { display: flex; flex-direction: column; gap: 0.8rem; }
        .input-group label { font-size: 0.75rem; font-weight: 900; color: var(--grey); text-transform: uppercase; letter-spacing: 1px; }
        .input-group textarea { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1rem; color: white; resize: none; font-family: inherit; transition: var(--transition); }
        .input-group textarea:focus { outline: none; border-color: var(--accent); background: rgba(0,0,0,0.5); }
        
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        /* Studio Content Details */
        .subtab-btn { background: none; border: none; font-size: 0.95rem; font-weight: 600; color: var(--grey); cursor: pointer; padding-bottom: 0.5rem; transition: color 0.2s; position: relative; }
        .subtab-btn:hover { color: white; }
        .subtab-btn.active { color: white; }
        .subtab-btn.active::after { content: ''; position: absolute; bottom: -8px; left: 0; right: 0; height: 3px; background: white; border-radius: 2px; }
        .c-table-row:hover { background: rgba(255,255,255,0.02) !important; cursor: pointer; }
        .custom-checkbox { width: 16px; height: 16px; accent-color: var(--accent); cursor: pointer; border-radius: 4px; }

      `}</style>
        </div>
    );
}
