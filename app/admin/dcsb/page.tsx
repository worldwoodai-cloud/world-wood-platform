'use client';

import { motion } from 'framer-motion';
import { triggerApprovalEmail } from '@/app/actions/email';
import { ShieldCheck, Info, Scale, AlertTriangle, CheckCircle, XCircle, ChevronRight, Filter, Play, Award, UserCheck, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';


export default function DCSBDashboard() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [activeTab, setActiveTab] = useState('pending');
    const [selectedFilm, setSelectedFilm] = useState<any>(null);
    const [films, setFilms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== 'admin') {
                router.push('/auth');
            } else {
                fetchFilms();
            }
        }
    }, [user, profile, authLoading, activeTab]);

    async function fetchFilms() {
        setLoading(true);
        try {
            const statusFilter = activeTab === 'pending' ? ['pending'] : ['approved', 'rejected'];

            let realFilms: any[] = [];
            const { data, error } = await supabase
                .from('films')
                .select('*, studios(name, id, profiles(email))')
                .in('status', statusFilter)
                .order('created_at', { ascending: false });

            if (!error && data) {
                realFilms = data;
            }

            if (typeof window !== 'undefined' && localStorage.getItem('nexa-demo-session')) {
                const demoFilms = JSON.parse(localStorage.getItem('nexa-demo-films') || '[]');
                const filteredDemoFilms = demoFilms.filter((f: any) => statusFilter.includes(f.status));
                setFilms([...filteredDemoFilms, ...realFilms]);
            } else {
                setFilms(realFilms);
            }

        } catch (err) {
            console.error('Error fetching films:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleDecision = async (status: 'approved' | 'rejected') => {
        if (!selectedFilm) return;
        setProcessing(true);

        try {
            if (selectedFilm.id.toString().startsWith('demo-')) {
                const demoFilms = JSON.parse(localStorage.getItem('nexa-demo-films') || '[]');
                const index = demoFilms.findIndex((f: any) => f.id === selectedFilm.id);
                if (index !== -1) {
                    demoFilms[index].status = status;
                    demoFilms[index].rating = selectedFilm.rating || 'G';
                    localStorage.setItem('nexa-demo-films', JSON.stringify(demoFilms));
                }
                alert(`Film ${status.toUpperCase()} successfully! (Demo Mode)`);
                setSelectedFilm(null);
                fetchFilms();
                return;
            }

            const { error } = await supabase
                .from('films')
                .update({
                    status,
                    rating: selectedFilm.rating || 'G'
                    // We can add more fields like feedback if we add them to the DB
                })
                .eq('id', selectedFilm.id);

            if (error) throw error;

            // Trigger Email Notification on Approval
            if (status === 'approved') {
                const studioEmail = selectedFilm.studios?.profiles?.email;
                if (studioEmail) {
                    await triggerApprovalEmail(studioEmail, selectedFilm.title, selectedFilm.studios?.name);
                }
            }

            alert(`Film ${status} successfully!`);
            setSelectedFilm(null);
            fetchFilms();
        } catch (err: any) {
            alert('Operation failed: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    if (authLoading) return (
        <div className="loading-screen">
            <div className="loader-inner">
                <ShieldCheck size={64} className="accent-text pulse" />
                <p>Establishing Secure Session...</p>
            </div>
            <style jsx>{`
                .loading-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--background); color: white; }
                .loader-inner { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
                .pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.5; transform: scale(0.95); } }
            `}</style>
        </div>
    );

    if (!user || profile?.role !== 'admin') return null;


    const handleReview = (film: any) => {
        setSelectedFilm(film);
    };


    return (
        <div className="dcsb-admin">
            <div className="container">
                <header className="page-header">
                    <div className="header-left">
                        <ShieldCheck size={48} className="accent-text" />
                        <div className="header-info">
                            <h1 className="title">DCSB <span className="accent-text">Review Board</span></h1>
                            <p className="subtitle">Digital Cinema Standards & Ethics Governance</p>
                        </div>
                    </div>
                    <div className="stats-header">
                        <div className="stat"><span>PENDING:</span> {films.filter(f => f.status === 'pending').length} FILMS</div>
                        <div className="stat"><span>REVIEWER:</span> {profile?.display_name}</div>
                    </div>

                </header>

                <section className="dashboard-content">
                    <aside className="review-sidebar glass">
                        <div className="filter-group">
                            <h3>Submission Queue</h3>
                            <div className="tabs">
                                <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Queue</button>
                                <button className={`tab-btn ${activeTab === 'audited' ? 'active' : ''}`} onClick={() => setActiveTab('audited')}>Audited</button>
                            </div>
                        </div>

                        <div className="queue-list">
                            {loading ? (
                                <div className="empty-queue">Scanning digital archives...</div>
                            ) : films.length === 0 ? (
                                <div className="empty-queue">Queue Clear. No films require audit.</div>
                            ) : films.map(f => (
                                <div key={f.id} className={`queue-card ${selectedFilm?.id === f.id ? 'active' : ''}`} onClick={() => handleReview(f)}>
                                    <div className="q-info">
                                        <h4>{f.title}</h4>
                                        <span>{f.studios?.name}</span>
                                    </div>
                                    <div className="q-meta">
                                        <span className="time">{new Date(f.created_at).toLocaleDateString()}</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </aside>

                    <main className="review-workspace">
                        {selectedFilm ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="workspace-inner glass"
                            >
                                <div className="workspace-header">
                                    <div className="film-identity">
                                        {selectedFilm.poster_url ? (
                                            <img src={selectedFilm.poster_url} className="poster-small" alt="" />
                                        ) : (
                                            <div className="poster-temp"></div>
                                        )}
                                        <div className="f-meta">
                                            <h2>{selectedFilm.title}</h2>
                                            <p>Submitted by <strong>{selectedFilm.studios?.name}</strong></p>
                                        </div>
                                    </div>
                                    <div className="quick-actions">
                                        <a href={selectedFilm.video_url} target="_blank" rel="noopener noreferrer" className="btn-glass">
                                            <Play size={16} /> Stream Preview
                                        </a>
                                        {selectedFilm.trailer_url && (
                                            <a href={selectedFilm.trailer_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                                Watch Trailer
                                            </a>
                                        )}
                                    </div>

                                </div>

                                <div className="review-grid">
                                    {/* Ethics Checkpoint */}
                                    <div className="review-section">
                                        <h3><ShieldAlert size={18} /> AI Ethics & Identity Audit</h3>
                                        <div className="checkpoint-list">
                                            <div className="check-item">
                                                <label className="checkbox-container">
                                                    <input type="checkbox" />
                                                    <span className="checkmark"></span>
                                                    No unauthorized real-world identities detected.
                                                </label>
                                            </div>
                                            <div className="check-item">
                                                <label className="checkbox-container">
                                                    <input type="checkbox" />
                                                    <span className="checkmark"></span>
                                                    Commercial license for AI models and data provided.
                                                </label>
                                            </div>
                                            <div className="check-item">
                                                <label className="checkbox-container">
                                                    <input type="checkbox" />
                                                    <span className="checkmark"></span>
                                                    AI Ethics Policy Compliance verified.
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Classification */}
                                    <div className="review-section">
                                        <h3><Info size={18} /> Official Classification</h3>
                                        <div className="rating-selector">
                                            {['G', '12+', '16+', '18+'].map(r => (
                                                <button
                                                    key={r}
                                                    className={`rating-btn ${selectedFilm.rating === r ? 'selected' : ''}`}
                                                    onClick={() => setSelectedFilm({ ...selectedFilm, rating: r })}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="descriptors-input">
                                            <label>Content Summary</label>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--grey)' }}>{selectedFilm.description}</p>
                                        </div>

                                    </div>

                                    {/* Badges/Curation */}
                                    <div className="review-section">
                                        <h3><Award size={18} /> Curation & Badges</h3>
                                        <div className="badge-options">
                                            <label className="badge-opt">
                                                <input type="checkbox" />
                                                <span className="b-label"><CheckCircle size={14} /> Official Selection</span>
                                            </label>
                                            <label className="badge-opt">
                                                <input type="checkbox" />
                                                <span className="b-label"><Award size={14} /> Festival Pick</span>
                                            </label>
                                            <label className="badge-opt">
                                                <input type="checkbox" />
                                                <span className="b-label"><UserCheck size={14} /> Verified Studio Original</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Feedback/Decision */}
                                    <div className="review-section feedback">
                                        <h3>Reviewer Feedback (Internal)</h3>
                                        <textarea rows={4} placeholder="Add detailed feedback for the studio or internal audit notes..."></textarea>
                                    </div>
                                </div>

                                <div className="workspace-footer">
                                    <button
                                        className="btn-danger"
                                        onClick={() => handleDecision('rejected')}
                                        disabled={processing}
                                    >
                                        <XCircle size={18} /> Reject Submission
                                    </button>
                                    <div className="spacer"></div>
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleDecision('approved')}
                                        disabled={processing}
                                    >
                                        <CheckCircle size={18} /> Approve & Publish
                                    </button>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="empty-workspace glass">
                                <AlertTriangle size={64} className="accent-text" />
                                <h2>No Submission Selected</h2>
                                <p>Select a film from the queue to start the DCSB audit process.</p>
                            </div>
                        )}
                    </main>
                </section>
            </div>

            <style jsx>{`
        .dcsb-admin { padding-top: 150px; padding-bottom: 100px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; }
        .header-left { display: flex; align-items: center; gap: 2rem; }
        .title { font-size: 3rem; font-weight: 950; text-transform: uppercase; margin-bottom: 0.2rem; }
        .subtitle { color: var(--grey); font-weight: 700; font-size: 0.9rem; letter-spacing: 1px; }
        .stats-header { display: flex; gap: 3rem; font-size: 0.75rem; font-weight: 800; color: var(--grey); letter-spacing: 2px; }
        .stats-header span { color: var(--accent); margin-right: 0.5rem; }

        .dashboard-content { display: grid; grid-template-columns: 350px 1fr; gap: 3rem; min-height: 800px; }
        .review-sidebar { padding: 2.5rem; border-radius: 20px; display: flex; flex-direction: column; gap: 2rem; height: fit-content; }
        .filter-group h3 { font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.5rem; color: var(--grey); }
        .tabs { display: flex; background: rgba(0,0,0,0.3); padding: 0.4rem; border-radius: 12px; gap: 0.4rem; }
        .tab-btn { flex: 1; padding: 0.8rem; border-radius: 8px; font-weight: 800; color: var(--grey); font-size: 0.8rem; transition: var(--transition); }
        .tab-btn.active { background: var(--surface); color: white; }

        .queue-list { display: flex; flex-direction: column; gap: 0.8rem; }
        .queue-card { padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: var(--transition); border-left: 0px solid var(--accent); }
        .queue-card:hover { background: rgba(255,255,255,0.06); }
        .queue-card.active { background: rgba(255,27,28,0.05); border-left: 4px solid var(--accent); }
        .q-info h4 { font-size: 1rem; font-weight: 800; margin-bottom: 0.2rem; }
        .q-info span { font-size: 0.8rem; color: var(--grey); font-weight: 600; }
        .q-meta { text-align: right; color: var(--grey); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 1rem; }

        .review-workspace { min-height: 800px; }
        .poster-small { width: 100px; height: 140px; border-radius: 12px; object-fit: cover; border: 1px solid var(--glass-border); }
        .workspace-inner { padding: 4rem; border-radius: 20px; }
        .workspace-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4rem; }
        .film-identity { display: flex; gap: 2.5rem; align-items: center; }
        .poster-temp { width: 100px; height: 140px; background: #222; border-radius: 12px; }
        .f-meta h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; }
        .f-meta p { color: var(--grey); font-size: 1.1rem; }
        .quick-actions { display: flex; gap: 1rem; }
        .quick-actions a { display: flex; align-items: center; gap: 0.8rem; }
        .empty-queue { padding: 2rem; color: var(--grey); font-size: 0.9rem; text-align: center; font-weight: 700; }


        .review-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4rem; margin-bottom: 4rem; }
        .review-section h3 { display: flex; align-items: center; gap: 0.8rem; font-size: 1.1rem; font-weight: 900; text-transform: uppercase; color: var(--grey); margin-bottom: 2.5rem; }
        .checkpoint-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .check-item label { display: flex; align-items: center; gap: 1.2rem; cursor: pointer; font-size: 1rem; color: #ccc; font-weight: 600; }
        .check-item input { width: 20px; height: 20px; }

        .rating-selector { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .rating-btn { padding: 1rem 2rem; border: 2px solid var(--glass-border); border-radius: 12px; font-weight: 900; font-size: 1.2rem; transition: var(--transition); }
        .rating-btn:hover { border-color: white; }
        .rating-btn.selected { background: white; color: black; border-color: white; }
        .descriptors-input label { display: block; margin-bottom: 1rem; font-weight: 800; color: var(--grey); }
        .descriptors-input input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); padding: 1.2rem; border-radius: 12px; color: white; font-weight: 700; }

        .badge-options { display: flex; flex-direction: column; gap: 1.2rem; }
        .badge-opt { display: flex; align-items: center; gap: 1rem; cursor: pointer; }
        .b-label { display: flex; align-items: center; gap: 0.8rem; padding: 1rem 1.5rem; background: rgba(255,255,255,0.04); border-radius: 12px; font-weight: 800; font-size: 0.9rem; transition: var(--transition); border: 1px solid transparent; }
        .badge-opt input { display: none; }
        .badge-opt input:checked + .b-label { background: rgba(255,27,28,0.1); border-color: var(--accent); color: var(--accent); }

        .review-section.feedback { grid-column: span 2; }
        .feedback textarea { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); border-radius: 12px; padding: 2rem; color: white; font-family: inherit; font-size: 1.1rem; }

        .workspace-footer { display: flex; border-top: 1px solid var(--glass-border); padding-top: 3rem; }
        .btn-danger { color: #ff3e3e; font-weight: 900; display: flex; align-items: center; gap: 1rem; text-transform: uppercase; font-size: 0.85rem; }
        .spacer { flex: 1; }
        .btn-primary { padding: 1.2rem 3rem; border-radius: 12px; text-transform: uppercase; font-size: 0.9rem; font-weight: 900; }

        .empty-workspace { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; gap: 2rem; }
        .empty-workspace h2 { font-size: 2.5rem; font-weight: 900; }
        .empty-workspace p { font-size: 1.2rem; color: var(--grey); max-width: 400px; }

        @media (max-width: 1200px) {
          .dashboard-content { grid-template-columns: 1fr; }
          .review-sidebar { order: 2; }
          .review-workspace { order: 1; }
          .review-grid { grid-template-columns: 1fr; }
          .review-section.feedback { grid-column: span 1; }
          .workspace-inner { padding: 2rem; }
        }
      `}</style>
        </div>
    );
}
