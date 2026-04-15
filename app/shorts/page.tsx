'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreVertical, Play, Pause, ChevronUp, ChevronDown, Music2, Zap, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getSessionId } from '@/lib/demo-session';

interface Short {
  id: string;
  title: string;
  studio: string;
  studioAvatar: string;
  thumbnail: string;
  videoUrl?: string;
  likes: string;
  comments: string;
  shares: string;
  views: string;
  description: string;
  hall: string;
  hallSlug: string;
  sound: string;
  isAd: boolean;
  adLabel?: string;
}

const shorts: Short[] = [
  {
    id: 's1', title: 'Neural Drift — 60s Teaser', studio: 'Pulse Motion Pictures', studioAvatar: 'PM',
    thumbnail: '/scifi-hall.png', likes: '190k', comments: '2,694', shares: '2k', views: '28M',
    description: 'A cyberpunk journey through fractured memories. Coming to Sci-Fi & Future Hall. #NeuralDrift #SciFi #NexaScreen',
    hall: 'Sci-Fi & Future', hallSlug: 'scifi', sound: 'Synthwave Beat — Neon Frontier', isAd: false,
  },
  {
    id: 's2', title: 'The Hollow — Opening Scene', studio: 'Midnight Reel Co.', studioAvatar: 'MR',
    thumbnail: '/horror-hall.png', likes: '18k', comments: '1.4k', shares: '3.5k', views: '312k',
    description: 'The first 60 seconds will change everything. Dare to watch? 🔻 #TheHollow #Horror #Premiere',
    hall: 'Horror & Dark Cinema', hallSlug: 'horror', sound: 'Ambient Horror — Dark Tones', isAd: false,
  },
  {
    id: 'ad-short-1', title: 'Submit Your Film to WORLD WOOD', studio: 'WORLD WOOD', studioAvatar: 'WW',
    thumbnail: '/experimental-hall.png', likes: '5.6k', comments: '234', shares: '890', views: '180k',
    description: 'Your film deserves a global audience. Apply now at worldwood.com/submit. Studios welcome! 🎬',
    hall: '', hallSlug: '', sound: 'WORLD WOOD — Official', isAd: true, adLabel: 'Sponsored',
  },
  {
    id: 's3', title: 'Realm of Echoes — Magic System Explained', studio: 'Solaris Digital', studioAvatar: 'SD',
    thumbnail: '/fantasy-hall.png', likes: '31k', comments: '2.1k', shares: '4.8k', views: '589k',
    description: 'How does magic work in Realm of Echoes? Here\'s the lore breakdown. ✨ #RealmOfEchoes #Fantasy #Lore',
    hall: 'Fantasy & Myth', hallSlug: 'fantasy', sound: 'Epic Fantasy — Orchestral', isAd: false,
  },
  {
    id: 's4', title: 'Iron Resolve — Stunt Reel', studio: 'Pulse Motion Pictures', studioAvatar: 'PM',
    thumbnail: '/action-hall.png', likes: '42k', comments: '3.3k', shares: '8.9k', views: '892k',
    description: 'No CGI. No doubles. Pure action filmmaking at its finest. 💥 #IronResolve #Action #Stunts',
    hall: 'Action & Spectacle', hallSlug: 'action', sound: 'Adrenaline Rush — Pulse', isAd: false,
  },
  {
    id: 'ad-short-2', title: 'DCSB Film Standards — Quality First', studio: 'DCSB Board', studioAvatar: 'DB',
    thumbnail: '/documentary-hall.png', likes: '3.2k', comments: '156', shares: '445', views: '98k',
    description: 'Every film on WORLD WOOD meets DCSB quality standards. Learn what makes cinema great.',
    hall: '', hallSlug: '', sound: 'DCSB Official', isAd: true, adLabel: 'Promoted',
  },
  {
    id: 's5', title: 'Fracture Lines — Art Process', studio: 'Aether Collective', studioAvatar: 'AC',
    thumbnail: '/experimental-hall.png', likes: '8.7k', comments: '456', shares: '1.1k', views: '134k',
    description: 'Behind the abstract visual language of Fracture Lines. Art meets cinema. 🎨 #Experimental #Art',
    hall: 'Experimental & Shorts', hallSlug: 'experimental', sound: 'Ambient Glitch — Aether', isAd: false,
  },
  {
    id: 's6', title: 'Circuit Stories — Real Voices', studio: 'Verdant Eye Films', studioAvatar: 'VE',
    thumbnail: '/documentary-hall.png', likes: '15k', comments: '1.8k', shares: '2.3k', views: '267k',
    description: 'The untold stories of digital pioneers. A 60-second glimpse into Circuit Stories. 📽️ #Documentary',
    hall: 'Documentary', hallSlug: 'documentary', sound: 'Acoustic Guitar — Verdant', isAd: false,
  },
  {
    id: 's7', title: 'The Omega Point — Final Trailer', studio: 'Neon Frontier Studios', studioAvatar: 'NF',
    thumbnail: '/scifi-hall.png', likes: '56k', comments: '4.2k', shares: '12k', views: '1.2M',
    description: 'The final trailer before premiere night. Are you ready for the singularity? 🌌 #OmegaPoint #Premiere',
    hall: 'Sci-Fi & Future', hallSlug: 'scifi', sound: 'Omega — Hans Zimmer Style', isAd: false,
  },
];

export default function ShortsPage() {
  const [dynamicShorts, setDynamicShorts] = useState<Short[]>(shorts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [disliked, setDisliked] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [videoError, setVideoError] = useState(false);

  const isEmbedVideo = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('youtube.com') || 
           lower.includes('youtu.be') || 
           lower.includes('vimeo.com') ||
           lower.includes('drive.google.com');
  };

  const isProbablyDirectVideo = (url?: string) => {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogg|mov|m4v|mkv|3gp|avi|flv)(\?.*)?$/i)) return true;
    if (lower.includes('supabase') || lower.includes('dropbox.com') || lower.includes('storage.googleapis.com') || lower.includes('cloudinary') || lower.startsWith('blob:') || lower.startsWith('data:video')) return true;
    if (lower.includes('localhost') || lower.match(/^\d+\.\d+\.\d+\.\d+/)) {
      if (lower.includes('.html') || lower.includes('.js') || lower.includes('.ts') || lower.endsWith('/')) return false;
      return true;
    }
    return false;
  };

  const toggleFullscreen = () => {
    if (!frameRef.current) return;
    if (!document.fullscreenElement) {
      if (frameRef.current.requestFullscreen) {
        frameRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };



  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let processed = url;
    if (url.includes('youtube.com/watch?v=')) {
      processed = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtube.com/shorts/')) {
      processed = url.replace('shorts/', 'embed/');
    } else if (url.includes('youtu.be/')) {
      const id = url.split('/').pop();
      processed = `https://www.youtube.com/embed/${id}`;
    } else if (url.includes('vimeo.com/')) {
      const id = url.split('/').pop();
      processed = `https://player.vimeo.com/video/${id}`;
    } else if (url.includes('drive.google.com/file/d/')) {
      const id = url.split('/d/')[1]?.split('/')[0];
      processed = `https://drive.google.com/file/d/${id}/preview`;
    }
    const params = '?autoplay=1&mute=1&loop=1&playsinline=1';
    if (processed.includes('?')) processed += params.replace('?', '&');
    else processed += params;
    return processed;
  };

  const goNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, shorts.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else { next.add(id); setDisliked(prev => { const d = new Set(prev); d.delete(id); return d; }); }
      return next;
    });
  };

  const toggleDislike = (id: string) => {
    setDisliked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else { next.add(id); setLiked(prev => { const l = new Set(prev); l.delete(id); return l; }); }
      return next;
    });
  };

  useEffect(() => {
    async function fetchSupabaseShorts() {
      try {
        const supabase = (await import('@/lib/supabase')).createClient();
        const { data, error } = await supabase
          .from('films')
          .select('*, studios(name)')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const transformed: Short[] = data.map(f => ({
            id: f.id,
            title: f.title,
            studio: f.studios?.name || 'Unknown Studio',
            studioAvatar: (f.studios?.name || 'U').charAt(0),
            thumbnail: f.thumbnail_url || '/scifi-hall.png',
            videoUrl: f.video_url,
            likes: '0',
            comments: '0',
            shares: '0',
            views: '0',
            description: f.description || '',
            hall: 'Digital Cinema',
            hallSlug: 'hall',
            sound: 'Original Audio',
            isAd: false
          }));

          setDynamicShorts(prev => {
              const filtered = transformed.filter(t => !prev.find(p => p.id === t.id));
              return [...filtered, ...prev];
          });
        }
      } catch (err) {
        console.error('Supabase shorts fetch failed:', err);
      }
    }
    fetchSupabaseShorts();

    // Inject any new shorts created from the studio dashboard
    if (typeof window !== 'undefined') {
      const storedShorts = localStorage.getItem('nexa-demo-shorts-posts');
      if (storedShorts) {
        try {
          let parsedShorts = JSON.parse(storedShorts);
          
          // Clean up expired blob URLs
          const currentSessionId = getSessionId();
          parsedShorts = parsedShorts.map((p: any) => {
            if (p.videoUrl && (p.videoUrl.startsWith('temp-blob|') || p.videoUrl.startsWith('blob:'))) {
              // Blobs expire on refresh. We check if they belong to the current SPA session.
              const actualUrl = p.videoUrl.startsWith('temp-blob|') ? p.videoUrl.split('|')[1] : p.videoUrl;
              const isExpired = p.sessionId !== currentSessionId;
              
              if (isExpired) {
                return { ...p, videoUrl: null, isExpired: true, expiredBlobUrl: actualUrl };
              }
              return { ...p, videoUrl: actualUrl };
            }
            return p;
          });

          setDynamicShorts(prev => {
              const filtered = parsedShorts.filter((p: any) => !prev.find(old => old.id === p.id));
              return [...filtered, ...prev];
          });
        } catch (e) {
          console.error("Failed to parse demo shorts posts", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) goNext();
      if (e.deltaY < -30) goPrev();
    };
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [goNext, goPrev]);

  const current = dynamicShorts[currentIndex];

  return (
    <div className="shorts-page" ref={containerRef}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="short-view"
        >
          {/* Main Frame — YouTube Aspect Ratio */}
          <div ref={frameRef} className="short-frame" onClick={() => setIsPaused(!isPaused)} onDoubleClick={toggleFullscreen}>
            {current.videoUrl && !videoError ? (
              isEmbedVideo(current.videoUrl) ? (
                <iframe 
                  src={getEmbedUrl(current.videoUrl)} 
                  className="short-img" 
                  style={{ border: 'none', objectFit: 'cover' }}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>
              ) : isProbablyDirectVideo(current.videoUrl) ? (
                <video 
                  key={current.videoUrl}
                  autoPlay={!isPaused} 
                  loop 
                  muted 
                  playsInline 
                  className="short-video-element" 
                  style={{ objectFit: 'cover' }} 
                  src={current.videoUrl}
                  onError={() => {
                    if (!current.videoUrl?.startsWith('blob:')) {
                        console.warn("Shorts source error for:", current.videoUrl);
                    }
                    setVideoError(true);
                  }}
                />
              ) : (
                <iframe 
                  src={getEmbedUrl(current.videoUrl)} 
                  className="short-img" 
                  style={{ border: 'none', objectFit: 'cover' }}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>
              )
            ) : (
              <img src={current.thumbnail} alt={current.title} className="short-img" />
            )}

            {/* Dark gradient for text readability at bottom */}
            <div className="short-gradient"></div>

            {/* Play/Pause indicator centrally */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  key="play"
                  className="pause-indicator"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play size={64} fill="white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top Ad Label */}
            {current.isAd && (
              <div className="short-ad-badge">
                <Zap size={14} fill="currentColor" /> {current.adLabel || 'Sponsored'}
              </div>
            )}

            {/* Bottom Inner Metadata (Title, Studio, Desc) */}
            <div className="short-bottom">
              <div className="short-studio-row">
                <div className="short-avatar">
                  <img src={current.thumbnail} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span className="short-studio-name">@{current.studio.replace(/\s+/g, '_')}</span>
                <button className="subscribe-btn">Subscribe</button>
              </div>
              <h2 className="short-title">{current.title}</h2>
              <p className="short-desc">{current.description}</p>
              <div className="short-sound">
                <Music2 size={12} />
                <div className="sound-marquee">
                  <span>{current.sound}</span>
                </div>
              </div>
            </div>

            {/* Base Progress Bar */}
            <div className="short-progress">
              <motion.div
                className="short-progress-fill"
                initial={{ width: '0%' }}
                animate={{ width: isPaused ? undefined : '100%' }}
                transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
              />
            </div>
          </div>

          {/* Right Action Column */}
          <div className="short-actions">
            <div className="action-container">
              <button className="action-btn" onClick={() => toggleLike(current.id)}>
                <ThumbsUp size={22} fill={liked.has(current.id) ? "white" : "none"} color="white" />
              </button>
              <span className="action-text">{liked.has(current.id) ? '191k' : current.likes}</span>
            </div>

            <div className="action-container">
              <button className="action-btn" onClick={() => toggleDislike(current.id)}>
                <ThumbsDown size={22} fill={disliked.has(current.id) ? "white" : "none"} color="white" />
              </button>
              <span className="action-text">Dislike</span>
            </div>

            <div className="action-container">
              <button className="action-btn">
                <MessageCircle size={22} />
              </button>
              <span className="action-text">{current.comments}</span>
            </div>

            <div className="action-container">
              <button className="action-btn">
                <Share2 size={22} />
              </button>
              <span className="action-text">Share</span>
            </div>

            <div className="action-container">
              <button className="action-btn">
                <MoreVertical size={22} />
              </button>
            </div>

            {/* Audio Spinner */}
            <div className="action-container" style={{ marginTop: '0.5rem' }}>
              <div className="audio-thumb">
                <img src={current.thumbnail} alt="" />
              </div>
            </div>
          </div>

          {/* Scroll Arrows on the far right (like YouTube) */}
          <div className="nav-arrows-col">
            <button className="nav-arrow" onClick={goPrev} disabled={currentIndex === 0}>
              <ChevronUp size={24} />
            </button>
            <button className="nav-arrow" onClick={goNext} disabled={currentIndex === dynamicShorts.length - 1}>
              <ChevronDown size={24} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        .shorts-page {
          background-color: #0f0f0f; /* YouTube Dark Theme background */
          min-height: 100vh;
          width: 100%;
          padding-top: 60px; /* Space for Navbar */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .short-view {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: calc(100vh - 80px); /* Tall viewport taking up screen */
          max-height: 860px;
          padding-bottom: 2rem;
          position: relative;
        }

        /* ── Main Vertical Video Frame ── */
        .short-frame {
          height: 100%;
          aspect-ratio: 9 / 16; /* PERFECT 9:16 YT FORMAT */
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: #000;
          cursor: pointer;
        }

        .short-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .short-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 15%, transparent 35%);
          pointer-events: none;
        }

        /* ── Overlay Metadata ── */
        .short-bottom {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 32px;
          z-index: 5;
          pointer-events: auto;
        }

        .short-studio-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }

        .short-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .short-studio-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: white;
        }

        .subscribe-btn {
          background: white;
          color: black;
          border: none;
          padding: 0.35rem 0.8rem;
          border-radius: 18px;
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .subscribe-btn:hover { background: #e0e0e0; }

        .short-title {
          font-size: 0.95rem;
          font-weight: 400;
          margin-bottom: 0.3rem;
          line-height: 1.4;
          color: white;
          /* text-shadow: 0 1px 2px rgba(0,0,0,0.8); */
        }
        
        .short-desc {
          font-size: 0.85rem;
          font-weight: 400;
          color: rgba(255,255,255,0.9);
          margin-bottom: 0.8rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .short-sound {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: white;
        }

        .sound-marquee {
          overflow: hidden;
          max-width: 150px;
        }
        .sound-marquee span {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 8s linear infinite;
        }

        /* ── Action Buttons Column (YT Style Right Side) ── */
        .short-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          margin-left: 1rem;
          padding-bottom: 0; /* Align with bottom of video */
        }

        .action-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .action-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #272727; /* YT dark surface item */
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .action-btn:hover {
          background: #3f3f3f;
        }

        .action-text {
          font-size: 0.8rem;
          font-weight: 500;
          color: #f1f1f1;
        }

        .audio-thumb {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
          background: #272727;
          border: 2px solid #3f3f3f;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spin 8s linear infinite;
        }
        .audio-thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* Navigation Arrows Column */
        .nav-arrows-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-left: 1rem;
          justify-content: center;
          height: 100%; /* Spans full height of view, arrows in middle */
        }
        .nav-arrow {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #272727;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nav-arrow:hover:not(:disabled) { background: #3f3f3f; }
        .nav-arrow:disabled { opacity: 0.2; cursor: default; }

        /* Status badges/UI overlay */
        .short-ad-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #ffd500;
          color: black;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 5;
        }

        .pause-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.6);
          border-radius: 50%;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .short-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255,255,255,0.2);
          z-index: 10;
        }
        .short-progress-fill {
          height: 100%;
          background: #ff0000; /* YT Red */
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .nav-arrows-col { display: none; } /* Hide detached arrows on mobile/tablet */
        }

        @media (max-width: 600px) {
          .shorts-page {
            padding-top: 0;
          }
          .short-view {
            height: 100vh;
            width: 100vw;
            padding-bottom: 0;
          }
          .short-frame {
            border-radius: 0;
            width: 100%;
            aspect-ratio: auto;
          }
          /* On pure mobile, actions live on top of the video on the right */
          .short-actions {
            position: absolute;
            right: 12px;
            bottom: 24px;
            margin-left: 0;
          }
          .action-btn {
            background: rgba(0,0,0,0.4);
            border-radius: 50%;
          }
          .short-bottom {
            right: 80px; /* Make space for overlapping actions */
            bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
}
