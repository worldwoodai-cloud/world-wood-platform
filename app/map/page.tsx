'use client';

import { motion } from 'framer-motion';
import { Zap, Users, Star, Box, Compass, ArrowRight, MapPin, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function DigitalMapPage() {
    const [hoveredHall, setHoveredHall] = useState<string | null>(null);

    const [following, setFollowing] = useState<string[]>([]);
    const [followedStudiosMeta, setFollowedStudiosMeta] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const fids = JSON.parse(localStorage.getItem('nexa-demo-following') || '[]');
            setFollowing(fids);
            
            // Mocking which studios are active in which halls for now
            // In a real app, this would be a join query in Supabase
            const mockFollowedMeta = [
                { id: 'demo-1', hallId: 'scifi', topFilm: 'The Omega Point' },
                { id: 'demo-2', hallId: 'horror', topFilm: 'Midnight Echoes' },
                { id: 'demo-4', hallId: 'action', topFilm: 'Neural Drift' },
            ].filter(m => fids.includes(m.id));
            
            setFollowedStudiosMeta(mockFollowedMeta);
        }
    }, []);

    const halls = [
        { id: 'scifi', name: 'Sci-Fi & Future', type: 'Titan Theater', x: 20, y: 22, color: '#00c2ff', icon: <Zap size={22} />, viewers: '12.4k', films: 8 },
        { id: 'action', name: 'Action & Spectacle', type: 'Pulse Arena', x: 65, y: 18, color: '#ff1b1c', icon: <Star size={22} />, viewers: '8.2k', films: 5 },
        { id: 'fantasy', name: 'Fantasy & Myth', type: 'Aether Spires', x: 42, y: 50, color: '#a855f7', icon: <Box size={22} />, viewers: '5.1k', films: 4 },
        { id: 'horror', name: 'Horror & Dark', type: 'Shadow Keep', x: 75, y: 65, color: '#ef4444', icon: <MapPin size={22} />, viewers: '3.8k', films: 3 },
        { id: 'experimental', name: 'Experimental', type: 'Neon Void', x: 15, y: 70, color: '#10b981', icon: <Compass size={22} />, viewers: '2.4k', films: 2 },
        { id: 'documentary', name: 'Documentary', type: 'Real-Eyes', x: 82, y: 35, color: '#f59e0b', icon: <Users size={22} />, viewers: '1.2k', films: 6 },
    ];

    // SVG connection lines from each hall to the center hub (Fantasy)
    const centerX = 42;
    const centerY = 50;

    return (
        <div className="map-page">
            <div className="container map-header">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="section-label">01 / WORLD NAVIGATION</span>
                    <h1 className="page-title">Digital <span className="accent-text">District</span></h1>
                    <p className="page-desc">Select a theater node to enter the localized cinematic experience.</p>
                </motion.div>

                <div className="live-stats glass">
                    <div className="stat">
                        <span className="label">GLOBAL VIEWERS</span>
                        <span className="value">34.2K</span>
                    </div>
                    <div className="divider"></div>
                    <div className="stat">
                        <span className="label">ACTIVE HALLS</span>
                        <span className="value">06 / 06</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="map-arena">
                    {/* Background Grid */}
                    <div className="grid-bg"></div>

                    {/* Radial glow at center */}
                    <div className="center-glow"></div>

                    {/* SVG Connection Lines */}
                    <svg className="connections-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {halls.map((hall) => (
                            <line
                                key={`line-${hall.id}`}
                                x1={`${hall.x}`}
                                y1={`${hall.y}`}
                                x2={`${centerX}`}
                                y2={`${centerY}`}
                                stroke={hoveredHall === hall.id ? hall.color : 'rgba(255,255,255,0.06)'}
                                strokeWidth={hoveredHall === hall.id ? '0.3' : '0.15'}
                                strokeDasharray={hoveredHall === hall.id ? '0' : '1 1'}
                                style={{ transition: 'all 0.4s ease' }}
                            />
                        ))}
                    </svg>

                    {/* Hall Nodes */}
                    {halls.map((hall, i) => (
                        <div key={hall.id} style={{ position: 'absolute', left: `${hall.x}%`, top: `${hall.y}%`, transform: 'translate(-50%, -50%)', zIndex: hoveredHall === hall.id ? 50 : 10 }}>
                            <Link href={`/halls/${hall.id}`} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    className={`hall-node ${hoveredHall === hall.id ? 'active' : ''}`}
                                    onMouseEnter={() => setHoveredHall(hall.id)}
                                    onMouseLeave={() => setHoveredHall(null)}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
                                    whileHover={{ scale: 1.05 }}
                                    style={{ padding: '20px', cursor: 'pointer' }} // Larger hit area
                                >
                                    {/* Pulse ring */}
                                    <div className="pulse-ring" style={{ borderColor: hall.color, animationDuration: followedStudiosMeta.find(m => m.hallId === hall.id) ? '1.2s' : '2.5s' }}></div>

                                    {/* Icon circle */}
                                    <div className="node-icon" style={{ 
                                        borderColor: hall.color, 
                                        color: hall.color, 
                                        boxShadow: followedStudiosMeta.find(m => m.hallId === hall.id) 
                                            ? `0 0 40px ${hall.color}, inset 0 0 15px ${hall.color}`
                                            : `0 0 25px ${hall.color}33` 
                                    }}>
                                        {hall.icon}
                                        {followedStudiosMeta.find(m => m.hallId === hall.id) && (
                                            <div className="nexus-sync-indicator" title="Nexus Sync: Followed Studio Active">
                                                <Zap size={8} fill="white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Always-visible label */}
                                    <div className="node-label">
                                        <span className="node-name" style={{ color: followedStudiosMeta.find(m => m.hallId === hall.id) ? 'white' : '' }}>{hall.name}</span>
                                        <span className="node-viewers"><span className="live-dot" style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88' }}></span>{hall.viewers}</span>
                                    </div>

                                    {/* Hover tooltip */}
                                    <div className="node-tooltip" style={{ borderColor: `${hall.color}44`, pointerEvents: 'auto' }}>
                                        <div className="tooltip-type" style={{ color: hall.color }}>{hall.type}</div>
                                        <div className="tooltip-name">{hall.name}</div>
                                        
                                        {followedStudiosMeta.find(m => m.hallId === hall.id) ? (
                                            <div className="nexus-alert glass">
                                                <div className="n-hdr"><Zap size={10} className="accent-text" fill="currentColor" /> NEXUS SYNC</div>
                                                <div className="n-film">Live: {followedStudiosMeta.find(m => m.hallId === hall.id)?.topFilm}</div>
                                            </div>
                                        ) : (
                                            <div className="tooltip-stats">
                                                <span><Eye size={12} /> {hall.viewers} viewers</span>
                                                <span>•</span>
                                                <span>{hall.films} films</span>
                                            </div>
                                        )}
                                        
                                        <div className="tooltip-enter" style={{ color: hall.color }}>
                                            ENTER HALL <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .map-page {
                    min-height: 100vh;
                    padding-top: 120px;
                    padding-bottom: 80px;
                    background: radial-gradient(ellipse at 50% 40%, rgba(20,20,30,1) 0%, rgba(5,5,5,1) 70%);
                    overflow: hidden;
                }
                .map-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                    position: relative;
                    z-index: 20;
                }
                .section-label {
                    font-size: 0.75rem;
                    font-weight: 900;
                    color: var(--accent);
                    letter-spacing: 2px;
                    margin-bottom: 1rem;
                    display: block;
                }
                .page-title {
                    font-size: 3.5rem;
                    font-weight: 950;
                    margin-bottom: 0.8rem;
                }
                .page-desc {
                    color: var(--grey);
                    font-size: 1rem;
                    max-width: 420px;
                }
                .live-stats {
                    display: flex;
                    padding: 1.2rem 2rem;
                    border-radius: 50px;
                    gap: 1.5rem;
                    align-items: center;
                }
                .stat {
                    display: flex;
                    flex-direction: column;
                }
                .stat .label { font-size: 0.6rem; font-weight: 900; color: var(--grey); letter-spacing: 1px; }
                .stat .value { font-size: 1.3rem; font-weight: 900; color: white; }
                .divider { width: 1px; height: 28px; background: var(--glass-border); }

                /* === MAP ARENA === */
                .map-arena {
                    position: relative;
                    width: 100%;
                    height: 65vh;
                    min-height: 500px;
                    border-radius: 20px;
                    background: rgba(8, 8, 15, 0.9);
                    border: 1px solid rgba(255,255,255,0.06);
                    overflow: hidden;
                }

                .grid-bg {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 60px 60px;
                    mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
                    -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
                }

                .center-glow {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                .connections-svg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }

                /* === HALL NODES === */
                .hall-node {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.6rem;
                }

                .pulse-ring {
                    position: absolute;
                    width: 56px;
                    height: 56px;
                    border: 1px solid;
                    border-radius: 50%;
                    animation: pulse-anim 2.5s infinite ease-out;
                    pointer-events: none;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                @keyframes pulse-anim {
                    0% { transform: translateX(-50%) scale(1); opacity: 0.6; }
                    100% { transform: translateX(-50%) scale(2); opacity: 0; }
                }

                .node-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: 2px solid;
                    background: rgba(5,5,5,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 5;
                }
                .hall-node:hover .node-icon {
                    transform: scale(1.15);
                    background: rgba(15,15,25,1);
                }

                /* Always-visible label below icon */
                .node-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    white-space: nowrap;
                }
                .node-name {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: rgba(255,255,255,0.7);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .node-viewers {
                    font-size: 0.6rem;
                    font-weight: 700;
                    color: var(--grey);
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .live-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    display: inline-block;
                }

                /* Hover tooltip */
                .node-tooltip {
                    position: absolute;
                    top: -10px;
                    left: calc(100% + 20px);
                    background: rgba(10, 10, 18, 0.95);
                    backdrop-filter: blur(12px);
                    border: 1px solid;
                    border-radius: 12px;
                    padding: 1.2rem 1.5rem;
                    min-width: 200px;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                    z-index: 100;
                }
                .hall-node:hover .node-tooltip {
                    opacity: 1;
                    transform: translateX(0);
                }
                .tooltip-type {
                    font-size: 0.6rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 0.4rem;
                }
                .tooltip-name {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.6rem;
                }
                .tooltip-stats {
                    display: flex;
                    gap: 0.6rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--grey);
                    margin-bottom: 1rem;
                    align-items: center;
                }
                .tooltip-stats span {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                .tooltip-enter {
                    font-size: 0.65rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .nexus-sync-indicator { position: absolute; top: -5px; right: -5px; background: var(--accent); color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px var(--accent); border: 2px solid #050505; z-index: 10; }
                .nexus-alert { margin-bottom: 1rem; padding: 0.8rem; border-radius: 8px; background: rgba(255,27,28,0.05); border: 1px solid rgba(255,27,28,0.2); }
                .n-hdr { font-size: 0.6rem; font-weight: 950; letter-spacing: 1px; margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.4rem; }
                .n-film { font-size: 0.85rem; font-weight: 700; color: white; }

                @media (max-width: 1024px) {
                    .page-title { font-size: 2.5rem; }
                    .live-stats { display: none; }
                    .map-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                    .map-arena { height: 50vh; min-height: 400px; }
                    .node-tooltip { display: none; }
                    .node-icon { width: 44px; height: 44px; }
                    .pulse-ring { width: 44px; height: 44px; }
                }
            `}</style>
        </div>
    );
}
