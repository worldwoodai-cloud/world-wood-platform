'use client';

import { motion } from 'framer-motion';
import {
    BarChart3,
    Film,
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    Settings,
    Layout,
    Clock,
    MoreVertical
} from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('submissions');

    const submissions = [
        { id: '1', title: 'Silicon Soul', studio: 'Aether Studios', submitted: '2 hours ago', hall: 'Sci-Fi & Future' },
        { id: '2', title: 'Midnight Echo', studio: 'Neon Foundry', submitted: '5 hours ago', hall: 'Horror' },
        { id: '3', title: 'The Glitch', studio: 'Void Collective', submitted: '1 day ago', hall: 'Experimental' },
    ];

    const studios = [
        { id: '4', name: 'Digital Dreams', owner: 'Alex Riv', requested: 'Mar 05, 2026' },
        { id: '5', name: 'Pixel Paradoxo', owner: 'Luna Wei', requested: 'Mar 04, 2026' },
    ];

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">WW <span>ADMIN</span></div>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}><Film size={18} /> Submissions</button>
                    <button className={`nav-item ${activeTab === 'studios' ? 'active' : ''}`} onClick={() => setActiveTab('studios')}><Users size={18} /> Studio Approval</button>
                    <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}><Calendar size={18} /> Schedule</button>
                    <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}><BarChart3 size={18} /> Analytics</button>
                    <button className={`nav-item ${activeTab === 'halls' ? 'active' : ''}`} onClick={() => setActiveTab('halls')}><Layout size={18} /> Manage Halls</button>
                    <div className="sidebar-footer">
                        <button className="nav-item"><Settings size={18} /> System Settings</button>
                    </div>
                </nav>
            </aside>

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <div className="breadcrumb">Admin / <span>{activeTab}</span></div>
                    <div className="profile-mini">
                        <span>Admin User</span>
                        <div className="avatar"></div>
                    </div>
                </header>

                <section className="stats-row">
                    <div className="stat-box glass">
                        <span className="label">Total Films</span>
                        <div className="value">142</div>
                        <div className="change plus">+12% this month</div>
                    </div>
                    <div className="stat-box glass">
                        <span className="label">Active Premieres</span>
                        <div className="value">3</div>
                        <div className="change">Running now</div>
                    </div>
                    <div className="stat-box glass">
                        <span className="label">Revenue</span>
                        <div className="value">$24,500</div>
                        <div className="change plus">+25% increase</div>
                    </div>
                    <div className="stat-box glass">
                        <span className="label">Pending Reviews</span>
                        <div className="value">12</div>
                        <div className="change-warn">Requires attention</div>
                    </div>
                </section>

                {activeTab === 'submissions' && (
                    <section className="table-section glass">
                        <div className="table-header">
                            <h2>Pending Submissions</h2>
                            <button className="btn-glass">Filter</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Film Title</th>
                                    <th>Studio</th>
                                    <th>Hall Category</th>
                                    <th>Submitted At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub.id}>
                                        <td className="bold">{sub.title}</td>
                                        <td>{sub.studio}</td>
                                        <td className="tag">{sub.hall}</td>
                                        <td className="grey">{sub.submitted}</td>
                                        <td className="actions">
                                            <button className="btn-approve" onClick={() => alert(`Approved ${sub.title}`)}><CheckCircle size={16} /></button>
                                            <button className="btn-reject" onClick={() => alert(`Rejected ${sub.title}`)}><XCircle size={16} /></button>
                                            <button className="btn-more" onClick={() => alert(`More options for ${sub.title}`)}><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === 'studios' && (
                    <section className="table-section glass">
                        <div className="table-header">
                            <h2>Studio Onboarding</h2>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Studio Name</th>
                                    <th>Owner</th>
                                    <th>Request Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studios.map(s => (
                                    <tr key={s.id}>
                                        <td className="bold">{s.name}</td>
                                        <td>{s.owner}</td>
                                        <td className="grey">{s.requested}</td>
                                        <td className="actions">
                                            <button className="btn-primary-mini" onClick={() => alert(`Approved Studio: ${s.name}`)}>Approve Studio</button>
                                            <button className="btn-reject-mini" onClick={() => alert(`Rejected Studio: ${s.name}`)}>Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>

            <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #050505;
        }
        .sidebar {
          width: 280px;
          background: #0a0a0a;
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          padding: 2rem;
        }
        .logo { font-size: 1.2rem; font-weight: 900; color: var(--accent); }
        .logo span { color: white; }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          gap: 0.5rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          color: var(--grey);
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .nav-item:hover, .nav-item.active {
          background: rgba(255,255,255,0.05);
          color: white;
        }
        .nav-item.active {
          color: var(--accent);
          background: rgba(255, 27, 28, 0.05);
        }
        .sidebar-footer {
          margin-top: auto;
          border-top: 1px solid var(--glass-border);
          padding-top: 1rem;
        }

        .dashboard-content {
          flex: 1;
          padding: 2rem 4rem;
          overflow-y: auto;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }
        .breadcrumb { font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--grey); font-size: 0.8rem; }
        .breadcrumb span { color: white; }
        .profile-mini { display: flex; align-items: center; gap: 1rem; font-weight: 700; font-size: 0.9rem; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent); }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-box {
          padding: 2rem;
          border-radius: 12px;
        }
        .stat-box .label { font-size: 0.75rem; text-transform: uppercase; color: var(--grey); font-weight: 800; letter-spacing: 1px; }
        .stat-box .value { font-size: 2rem; font-weight: 900; margin: 0.5rem 0; }
        .stat-box .change { font-size: 0.8rem; color: var(--grey); }
        .stat-box .change.plus { color: #00ff88; }
        .stat-box .change-warn { color: var(--accent); }

        .table-section {
          padding: 2rem;
          border-radius: 12px;
        }
        .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .table-header h2 { font-size: 1.2rem; font-weight: 800; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 1rem; border-bottom: 1px solid var(--glass-border); color: var(--grey); font-size: 0.8rem; text-transform: uppercase; }
        .data-table td { padding: 1.2rem 1rem; border-bottom: 1px solid var(--glass-border); font-size: 0.9rem; }
        .data-table .bold { font-weight: 800; color: white; }
        .data-table .grey { color: var(--grey); }
        .data-table .tag { color: var(--accent); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
        .actions { display: flex; gap: 0.5rem; }
        .btn-approve { color: #00ff88; }
        .btn-reject { color: #ff3333; }
        .btn-more { color: var(--grey); }
        .btn-primary-mini { background: var(--accent); padding: 0.5rem 1rem; border-radius: 4px; font-weight: 700; font-size: 0.75rem; color: white; }
        .btn-reject-mini { background: rgba(255,255,255,0.05); padding: 0.5rem 1rem; border-radius: 4px; font-weight: 700; font-size: 0.75rem; color: #ff3333; }
      `}</style>
        </div>
    );
}
