'use client';

'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Play, Clock, ArrowRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero({ imageUrl }: { imageUrl: string }) {
  const { user, profile } = useAuth();
  
  return (
    <section className="hero-root">
      <div className="hero-visual">
        <div 
          className="hero-media" 
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="hero-scrim-main" />
        <div className="hero-scrim-bottom" />
      </div>

      <div className="container hero-content-wrapper">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hero-main-force-left"
        >
          <div className="hero-header-left">
            <span className="hero-tagline-accent">WORLD WOOD ORIGINAL</span>
            <h1 className="hero-display-huge">
              The <span className="text-gradient">Future</span> of <br/>
              Independent Cinema
            </h1>
          </div>
          
          <p className="hero-summary-left">
            Experience the world's premier digital cinema. Curated, high-fidelity <br className="desktop-only" />
            screenings for the modern era of storytelling.
          </p>

          <div className="hero-cta-left">
            {profile?.role === 'admin' ? (
              <Link href="/admin/dcsb" className="btn-primary">
                <ShieldCheck size={20} /> DCSB Dashboard
              </Link>
            ) : profile?.role === 'studio' ? (
              <Link href="/studio/dashboard" className="btn-primary">
                <LayoutDashboard size={20} /> Manage Studio
              </Link>
            ) : (
              <Link href="/feed" className="btn-primary">
                <Play fill="currentColor" size={18} /> Start Screening
              </Link>
            )}
            
            <Link href="/studios" className="btn-glass">
              Browse Creators
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .hero-root {
          position: relative;
          height: 100vh;
          min-height: 800px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
          background: #000;
        }

        .hero-visual {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero-media {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(0.7);
          animation: nxSlowZoom 30s infinite alternate;
        }

        @keyframes nxSlowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }

        .hero-scrim-main {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.4) 50%, rgba(5, 5, 5, 0.8) 100%);
        }

        .hero-scrim-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 300px;
          background: linear-gradient(to top, #050505 0%, transparent 100%);
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          text-align: left !important;
        }

        .hero-main-force-left {
          max-width: 900px;
          padding-top: 100px;
          text-align: left !important;
          display: flex;
          flex-direction: column;
          align-items: flex-start !important;
        }

        .hero-tagline-accent {
          color: var(--accent);
          font-weight: 800;
          letter-spacing: 0.3em;
          font-size: 0.75rem;
          margin-bottom: 2rem;
          display: block;
          text-align: left;
        }

        .hero-display-huge {
          font-family: var(--font-outfit);
          font-size: clamp(3.5rem, 8vw, 6rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin-bottom: 2rem;
          color: white;
          text-align: left;
        }

        .hero-summary-left {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 3.5rem;
          max-width: 650px;
          text-align: left;
        }

        .hero-cta-left {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
        }

        @media (max-width: 768px) {
          .hero-main-force-left {
            text-align: center !important;
            padding-top: 0;
            align-items: center !important;
          }
          .hero-cta-left {
            flex-direction: column;
            width: 100%;
          }
          .hero-cta-left :global(a) {
            width: 100%;
            justify-content: center;
          }
          .desktop-only {
            display: none;
          }
          .hero-display-huge {
            text-align: center;
          }
          .hero-summary-left {
            text-align: center;
          }
          .hero-tagline-accent {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
