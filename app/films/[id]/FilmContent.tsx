'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Eye, Clock, ThumbsUp, MessageSquare, Share2, MoreVertical, Sparkles, TrendingUp, Filter, ChevronRight, Flame, Zap, X, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getSessionId } from '@/lib/demo-session';

const categories = ['All', 'Sci-Fi', 'Action', 'Horror', 'Fantasy', 'Documentary', 'Experimental', 'Shorts', 'Premieres', 'Trending'];

interface FeedItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl?: string; // Optional for mock data, required for actual uploads
  studio: string;
  studioAvatar: string;
  views: string;
  timeAgo: string;
  duration: string;
  likes: string;
  hall: string;
  category: string;
  isPremiere: boolean;
  isAd: boolean;
  studioId?: string;
}

const feedItems: FeedItem[] = [
  // Regular trailers
  { id: 'omega-point-trailer', title: 'The Omega Point — Official Trailer', thumbnail: '/scifi-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', studio: 'Neon Frontier Studios', studioAvatar: 'NF', views: '124K', timeAgo: '2 days ago', duration: '2:34', likes: '8.2K', hall: 'Sci-Fi & Future', category: 'Sci-Fi', isPremiere: true, isAd: false, studioId: 'demo-1' },
  { id: 'realm-echoes-trailer', title: 'Realm of Echoes — First Look Teaser', thumbnail: '/fantasy-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', studio: 'Solaris Digital', studioAvatar: 'SD', views: '89K', timeAgo: '5 days ago', duration: '1:48', likes: '5.6K', hall: 'Fantasy & Myth', category: 'Fantasy', isPremiere: false, isAd: false, studioId: 'demo-6' },
  // AD
  { id: 'ad-1', title: 'Parallax Studios — Now Accepting Submissions', thumbnail: '/action-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', studio: 'Parallax Studios', studioAvatar: 'PS', views: '45K', timeAgo: 'Promoted', duration: '0:30', likes: '1.2K', hall: '', category: 'Ad', isPremiere: false, isAd: true },
  { id: 'hollow-trailer', title: 'The Hollow — Full Trailer | Horror Premiere', thumbnail: '/horror-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', studio: 'Midnight Reel Co.', studioAvatar: 'MR', views: '203K', timeAgo: '1 day ago', duration: '3:12', likes: '15K', hall: 'Horror & Dark Cinema', category: 'Horror', isPremiere: true, isAd: false },
  { id: 'iron-resolve', title: 'Iron Resolve — Behind The Scenes', thumbnail: '/action-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', studio: 'Pulse Motion Pictures', studioAvatar: 'PM', views: '67K', timeAgo: '3 days ago', duration: '4:20', likes: '3.8K', hall: 'Action & Spectacle', category: 'Action', isPremiere: false, isAd: false },
  { id: 'circuit-stories', title: 'Circuit Stories — Documentary Trailer', thumbnail: '/documentary-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', studio: 'Verdant Eye Films', studioAvatar: 'VE', views: '31K', timeAgo: '1 week ago', duration: '2:55', likes: '2.1K', hall: 'Documentary', category: 'Documentary', isPremiere: false, isAd: false },
  // AD
  { id: 'ad-2', title: 'WORLD WOOD Premium — Get First Access to Premieres', thumbnail: '/experimental-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', studio: 'WORLD WOOD', studioAvatar: 'WW', views: '120K', timeAgo: 'Sponsored', duration: '0:15', likes: '890', hall: '', category: 'Ad', isPremiere: false, isAd: true },
  { id: 'fracture-lines', title: 'Fracture Lines — Experimental Short Film', thumbnail: '/experimental-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', studio: 'Aether Collective', studioAvatar: 'AC', views: '18K', timeAgo: '4 days ago', duration: '8:00', likes: '1.5K', hall: 'Experimental & Shorts', category: 'Experimental', isPremiere: false, isAd: false },
  { id: 'neural-drift', title: 'Neural Drift — Cyberpunk Teaser', thumbnail: '/scifi-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4', studio: 'Pulse Motion Pictures', studioAvatar: 'PM', views: '156K', timeAgo: '6 hours ago', duration: '1:22', likes: '11K', hall: 'Sci-Fi & Future', category: 'Sci-Fi', isPremiere: false, isAd: false },
  { id: 'verdant-throne', title: 'The Verdant Throne — World Premiere Trailer', thumbnail: '/fantasy-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', studio: 'Aether Collective', studioAvatar: 'AC', views: '42K', timeAgo: '2 days ago', duration: '2:10', likes: '3.2K', hall: 'Fantasy & Myth', category: 'Fantasy', isPremiere: true, isAd: false },
  { id: 'whisper-house', title: 'Whisper House — Midnight Horror', thumbnail: '/horror-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', studio: 'Midnight Reel Co.', studioAvatar: 'MR', views: '78K', timeAgo: '12 hours ago', duration: '1:55', likes: '6.7K', hall: 'Horror & Dark Cinema', category: 'Horror', isPremiere: false, isAd: false },
  // AD
  { id: 'ad-3', title: 'DCSB Film Festival 2026 — Submit Your Film Now', thumbnail: '/documentary-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', studio: 'DCSB Board', studioAvatar: 'DB', views: '33K', timeAgo: 'Promoted', duration: '0:45', likes: '2.3K', hall: '', category: 'Ad', isPremiere: false, isAd: true },
  { id: 'storm-chaser', title: 'Storm Chaser — Action Spectacle Reel', thumbnail: '/action-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', studio: 'Neon Frontier Studios', studioAvatar: 'NF', views: '91K', timeAgo: '3 days ago', duration: '3:45', likes: '7.1K', hall: 'Action & Spectacle', category: 'Action', isPremiere: false, isAd: false },
  { id: 'void-canvas', title: 'Void Canvas — Abstract Digital Art Film', thumbnail: '/experimental-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', studio: 'Aether Collective', studioAvatar: 'AC', views: '12K', timeAgo: '1 week ago', duration: '12:00', likes: '980', hall: 'Experimental & Shorts', category: 'Experimental', isPremiere: false, isAd: false },
  { id: 'quantum-echo', title: 'Quantum Echo — Time Loop Narrative', thumbnail: '/scifi-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', studio: 'Solaris Digital', studioAvatar: 'SD', views: '58K', timeAgo: '4 days ago', duration: '2:40', likes: '4.3K', hall: 'Sci-Fi & Future', category: 'Sci-Fi', isPremiere: false, isAd: false },
  { id: 'last-frame', title: 'The Last Frame — A Cinema Documentary', thumbnail: '/documentary-hall.png', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', studio: 'Verdant Eye Films', studioAvatar: 'VE', views: '22K', timeAgo: '6 days ago', duration: '5:30', likes: '1.8K', hall: 'Documentary', category: 'Documentary', isPremiere: false, isAd: false },
];

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTrailer, setActiveTrailer] = useState<FeedItem | null>(null);
  const [dynamicFeedItems, setDynamicFeedItems] = useState<FeedItem[]>(feedItems);
  const [isMounted, setIsMounted] = useState(false);

  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isEmbedVideo = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('youtube.com') || 
           lower.includes('youtu.be') || 
           lower.includes('vimeo.com') || 
           lower.includes('dailymotion.com') ||
           lower.includes('twitch.tv') ||
           lower.includes('drive.google.com');
  };

  const isProbablyDirectVideo = (url?: string) => {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    // Known extensions
    if (lower.match(/\.(mp4|webm|ogg|mov|m4v|mkv|3gp|avi|flv)(\?.*)?$/i)) return true;
    // Known production storage hosts
    if (lower.includes('supabase') || lower.includes('dropbox.com') || lower.includes('storage.googleapis.com') || lower.includes('cloudinary') || lower.startsWith('blob:') || lower.startsWith('data:video')) return true;
    // Local development - only if it has a common video-like path or no extension but not a known page
    if (lower.includes('localhost') || lower.match(/^\d+\.\d+\.\d+\.\d+/)) {
      if (lower.includes('.html') || lower.includes('.js') || lower.includes('.ts') || lower.endsWith('/')) return false;
      return true;
    }
    
    return false;
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
    
    // Add autoplay if needed (optional)
    if (processed.includes('?')) processed += '&autoplay=1';
    else processed += '?autoplay=1';
    
    return processed;
  };

  // Custom Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player Handlers
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      if (dur) {
        setProgress((current / dur) * 100);
        setCurrentTime(formatTime(current));
        setDurationStr(formatTime(dur));
      }
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error("Playback failed to start:", error);
            setIsPlaying(false);
          });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (activeTrailer && activeTrailer.videoUrl) {
      setIsMuted(true);
      setProgress(0);
      setCurrentTime('0:00');
      setIsPlaying(false);
      setVideoError(false); // Reset error state on new video
      
      const timer = setTimeout(() => {
        if (videoRef.current && !isEmbedVideo(activeTrailer.videoUrl) && isProbablyDirectVideo(activeTrailer.videoUrl)) {
          videoRef.current.muted = true;
          videoRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.log("Autoplay check suppressed:", err.message);
            setIsPlaying(false);
          });
        }
      }, 500); // Increased delay for stability
      return () => clearTimeout(timer);
    }
  }, [activeTrailer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTrailer && activeTrailer.videoUrl) {
        if (e.code === 'Space') {
          e.preventDefault();
          togglePlay();
        } else if (e.code === 'Escape') {
          if (videoRef.current) videoRef.current.pause();
          setActiveTrailer(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTrailer, isPlaying]);

  useEffect(() => {
    async function fetchSupabaseFeed() {
      try {
        const supabase = (await import('@/lib/supabase')).createClient();
        
        // Fetch films - removing 'type' filter as it doesn't exist in the base schema yet
        const { data, error } = await supabase
          .from('films')
          .select('*, studios(name)')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          return; // Don't throw, just log details
        }

        if (data && data.length > 0) {
          const transformed = data.map(f => ({
            id: f.id,
            title: f.title,
            // Fallback to poster_url if thumbnail_url is missing
            thumbnail: f.thumbnail_url || f.poster_url || '/scifi-hall.png',
            videoUrl: f.video_url,
            studio: f.studios?.name || 'Unknown Studio',
            studioId: f.studio_id,
            studioAvatar: (f.studios?.name || 'U').charAt(0),
            views: '0',
            timeAgo: 'Just now',
            duration: f.runtime_minutes ? `${Math.floor(f.runtime_minutes / 60)}:${(f.runtime_minutes % 60).toString().padStart(2, '0')}` : '0:10',
            likes: '0',
            hall: 'Featured Hall',
            category: 'Cinema',
            isPremiere: f.is_premiere || false,
            isAd: false
          }));
          setDynamicFeedItems(prev => {
              // Merge avoiding duplicates
              const filtered = transformed.filter((t: any) => !prev.find((p: any) => p.id === t.id));
              return [...filtered, ...prev];
          });
        }
      } catch (err) {
        console.error('Supabase feed fetch failed:', err);
      }
    }
    fetchSupabaseFeed();

    // Check if the user posted a new custom feed trailer from the dashboard
    if (typeof window !== 'undefined') {
      const storedPosts = localStorage.getItem('nexa-demo-feed-posts');
      if (storedPosts) {
        try {
          let parsedPosts = JSON.parse(storedPosts);
          
          // Clean up expired blob URLs
          const currentSessionId = getSessionId();
          parsedPosts = parsedPosts.map((p: any) => {
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

          setDynamicFeedItems(prev => {
              const filtered = parsedPosts.filter((p: any) => !prev.find(old => old.id === p.id));
              return [...filtered, ...prev];
          });
        } catch (e) {
          console.error("Failed to parse demo feed posts", e);
        }
      }
    }
  }, []);

  const filteredItems = activeCategory === 'All'
    ? dynamicFeedItems
    : dynamicFeedItems.filter(item => item.category === activeCategory || item.isAd);

  return (
    <div className="feed-page">
      <div className="container">
        {/* ── Category Chips ── */}
        <div className="category-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'Trending' && <TrendingUp size={14} />}
              {cat === 'Premieres' && <Sparkles size={14} />}
              {cat}
            </button>
          ))}
        </div>

        {/* ── Feed Grid ── */}
        <div className="feed-grid">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.4) }}
              className="feed-card-wrapper"
            >
              <div
                className="feed-card"
                onClick={() => {
                  if (!item.isAd) {
                    setActiveTrailer(item);
                  }
                }}
              >
                {/* Thumbnail */}
                <div
                  className="thumbnail"
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img src={item.thumbnail} alt={item.title} className={hoveredCard === item.id && item.videoUrl && !isEmbedVideo(item.videoUrl) && isProbablyDirectVideo(item.videoUrl) ? 'hidden-thumb' : ''} />
                  
                  {hoveredCard === item.id && item.videoUrl && !isEmbedVideo(item.videoUrl) && isProbablyDirectVideo(item.videoUrl) && (
                    <motion.video 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={item.videoUrl} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="hover-preview"
                      onLoadedData={(e) => {
                        const v = e.target as HTMLVideoElement;
                        v.play().catch(err => console.log("Hover play blocked", err));
                      }}
                    />
                  )}

                  <div className="thumb-overlay">
                    <div className={`play-btn ${hoveredCard === item.id && !item.videoUrl ? 'show' : ''}`}>
                      <Play fill="white" size={24} />
                    </div>
                  </div>
                  <span className="duration">{item.duration}</span>
                  {item.isPremiere && <span className="premiere-badge"><Sparkles size={10} /> PREMIERE</span>}
                  {item.isAd && <span className="ad-badge"><Zap size={10} /> AD</span>}
                  {/* Progress bar for "watched" effect - only on client to avoid hydration mismatch */}
                  {isMounted && !item.isAd && (item.id.length % 7 > 4) && (
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(item.id.length * 13) % 70 + 20}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="card-info">
                  <Link href={`/studios/${item.studioId || 'demo'}`} className="studio-avatar" onClick={(e) => e.stopPropagation()}>
                    {item.studioAvatar}
                  </Link>
                  <div className="card-text">
                    <h3 className="card-title">{item.title}</h3>
                    <div className="card-meta">
                      <Link href={`/studios/${item.studioId || 'demo'}`} className="studio-link" onClick={(e) => e.stopPropagation()}>
                        <span className="studio-name">{item.studio}</span>
                      </Link>
                      <span className="stats">
                        <Eye size={12} /> {item.views} views · {item.timeAgo}
                      </span>
                    </div>
                  </div>
                  <button className="more-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cinematic Trailer Player Overlay */}
      <AnimatePresence>
        {activeTrailer && (
          <div className="trailer-modal-overlay" onClick={() => setActiveTrailer(null)}>
            <motion.div
              className="trailer-modal-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-trailer-btn" onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                setActiveTrailer(null);
              }}>
                <X size={24} />
              </button>

              <div
                ref={containerRef}
                className="trailer-player-container"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
                onClick={togglePlay}
                onDoubleClick={handleFullscreen}
              >
                {activeTrailer.videoUrl && !videoError ? (
                  isEmbedVideo(activeTrailer.videoUrl) ? (
                    <iframe
                      src={getEmbedUrl(activeTrailer.videoUrl)}
                      className="video-iframe player-fallback-img"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      style={{ border: 'none' }}
                    ></iframe>
                  ) : isProbablyDirectVideo(activeTrailer.videoUrl) ? (
                    <video
                      key={activeTrailer.videoUrl} 
                      ref={videoRef}
                      src={activeTrailer.videoUrl}
                      playsInline
                      className="player-fallback-img"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                      onError={() => {
                        if (!activeTrailer.videoUrl?.startsWith('blob:')) {
                            console.warn("Direct video source issue. This can happen if the original file is missing or restricted. Source:", activeTrailer.videoUrl);
                        } else {
                            console.error("Direct video source error for:", activeTrailer.videoUrl);
                        }
                        setVideoError(true);
                      }}
                      autoPlay
                      muted 
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(activeTrailer.videoUrl)}
                      className="video-iframe player-fallback-img"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      style={{ border: 'none' }}
                    ></iframe>
                  )
                ) : (
                  <img src={activeTrailer.thumbnail} alt={activeTrailer.title} className="player-fallback-img" />
                )}

                {/* Simulated Custom YouTube-Style Controls */}
                <div className={`player-controls custom-youtube-controls ${showControls || !isPlaying ? 'visible' : 'hidden'}`} onClick={(e) => e.stopPropagation()}>
                  <div className="player-gradient-overlay"></div>

                  <div className="controls-content-wrapper">
                    <div className="custom-progress-container" onClick={handleSeek}>
                      <div className="custom-progress-track">
                        <div className="custom-progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    <div className="controls-row">
                      <div className="left-controls">
                        <button className="c-control-btn" onClick={togglePlay}>
                          {isPlaying ? <Pause fill="white" size={22} className="c-icon" /> : <Play fill="white" size={22} className="c-icon" />}
                        </button>
                        <button className="c-control-btn" onClick={toggleMute}>
                          {isMuted ? <VolumeX size={22} className="c-icon" /> : <Volume2 size={22} className="c-icon" />}
                        </button>
                        <span className="c-time-display">
                          {activeTrailer.videoUrl ? `${currentTime} / ${durationStr}` : `0:00 / ${activeTrailer.duration}`}
                        </span>
                      </div>
                      <div className="right-controls">
                        <button className="c-control-btn"><Settings size={20} className="c-icon c-ghost" /></button>
                        {activeTrailer.videoUrl && (
                          <button className="c-control-btn" onClick={handleFullscreen}><Maximize size={20} className="c-icon" /></button>
                        )}
                        <button className="c-action-btn" onClick={() => window.location.href = `/halls/${activeTrailer.hall ? activeTrailer.hall.toLowerCase().split(' ')[0] : 'scifi'}`}>
                          Visit Hall
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="trailer-metadata">
                <h2>{activeTrailer.title}</h2>
                <div className="t-meta-row">
                  <div className="t-studio">
                    <span className="t-avatar">{activeTrailer.studioAvatar}</span>
                    <span>{activeTrailer.studio}</span>
                  </div>
                  <div className="t-stats">
                    <span>{activeTrailer.views} views</span>
                    <span>•</span>
                    <span>{activeTrailer.timeAgo}</span>
                  </div>
                  {activeTrailer.isPremiere && <span className="premiere-badge inline"><Sparkles size={12} /> PREMIERE</span>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .feed-page {
          padding-top: 100px;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        /* ── Category Bar ── */
        .category-bar {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 0 2rem;
          overflow-x: auto;
          position: sticky;
          top: 80px;
          z-index: 50;
          background: var(--background);
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .category-bar::-webkit-scrollbar { display: none; }
        .cat-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
          background: var(--surface);
          color: var(--grey);
          transition: var(--transition);
          border: 1px solid transparent;
        }
        .cat-chip:hover {
          color: white;
          background: var(--surface-hover);
        }
        .cat-chip.active {
          background: white;
          color: black;
        }

        /* ── Feed Grid ── */
        .feed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem 1.5rem;
        }

        /* ── Feed Card ── */
        .feed-card {
          display: block;
          cursor: pointer;
        }
        .thumbnail {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          background: var(--surface);
        }
        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }
        .thumbnail img.hidden-thumb {
          opacity: 0;
        }
        .hover-preview {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
          pointer-events: none;
        }
        .feed-card:hover .thumbnail img:not(.hidden-thumb) {
          transform: scale(1.05);
        }
        .thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
          z-index: 1;
        }
        .feed-card:hover .thumb-overlay {
          background: rgba(0,0,0,0.35);
        }
        .play-btn {
          width: 56px;
          height: 56px;
          background: rgba(255,27,28,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }
        .play-btn.show {
          opacity: 1;
          transform: scale(1);
        }
        .duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.85);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          font-family: monospace;
          z-index: 3;
        }
        .premiere-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: var(--accent);
          color: white;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 3;
        }
        .ad-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: linear-gradient(135deg, #d4af37, #b8860b);
          color: black;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 3;
        }
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.2);
        }
        .progress-fill {
          height: 100%;
          background: var(--accent);
        }

        /* ── Card Info ── */
        .card-info {
          display: flex;
          gap: 0.8rem;
          padding: 0.8rem 0.2rem;
          align-items: flex-start;
        }
        .studio-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--surface-hover);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          flex-shrink: 0;
          border: 2px solid var(--glass-border);
        }
        .card-text {
          flex: 1;
          min-width: 0;
        }
        .card-title {
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0.3rem;
        }
        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .studio-name {
          font-size: 0.8rem;
          color: var(--grey);
          font-weight: 600;
          cursor: pointer;
          display: inline-block;
        }
        .studio-link {
          text-decoration: none;
          width: fit-content;
        }
        .studio-name:hover {
          color: white;
        }
        .stats {
          font-size: 0.75rem;
          color: var(--grey);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .more-btn {
          color: var(--grey);
          padding: 0.3rem;
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .feed-card:hover .more-btn {
          opacity: 1;
        }

        @media (max-width: 1200px) {
          .feed-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        }
        @media (max-width: 768px) {
          .feed-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .category-bar { top: 60px; }
          .trailer-modal-content { border-radius: 0; }
        }

        /* ── Trailer Modal ── */
        .trailer-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .trailer-modal-content {
          background: #0f0f0f; /* Pure dark */
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 1100px;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .close-trailer-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 20;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .close-trailer-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .trailer-player-container {
          position: relative;
          aspect-ratio: 16/9;
          width: 100%;
          background: #000;
        }

        .player-fallback-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
        }

        .player-gradient-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 120px;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }

        .controls-content-wrapper {
          position: relative;
          z-index: 2;
          padding: 0 1rem 0.5rem 1rem;
        }

        .custom-youtube-controls {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .custom-youtube-controls.hidden {
          opacity: 0;
          pointer-events: none;
        }
        
        .custom-youtube-controls.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .custom-progress-container {
          padding: 10px 0;
          cursor: pointer;
          position: relative;
          margin-bottom: 5px;
        }

        .custom-progress-track {
          height: 4px;
          background: rgba(255,255,255,0.3);
          transition: height 0.1s, transform 0.1s;
        }

        .custom-progress-container:hover .custom-progress-track {
          height: 6px;
          transform: scaleY(1.2);
        }

        .custom-progress-fill {
          height: 100%;
          background: #ff0000;
          position: relative;
        }

        .custom-progress-container:hover .custom-progress-fill::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ff0000;
        }

        .c-control-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          transition: transform 0.1s;
        }

        .c-control-btn:active {
          transform: scale(0.9);
        }

        .c-icon {
          color: white;
          transition: color 0.2s;
        }

        .c-control-btn:hover .c-icon {
          color: var(--accent);
        }

        .c-ghost {
          color: #eee;
        }

        .c-time-display {
          color: #eee;
          font-size: 0.85rem;
          font-family: Inter, Roboto, sans-serif;
          margin-left: 0.5rem;
          font-variant-numeric: tabular-nums;
        }

        .c-action-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          margin-left: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .c-action-btn:hover {
          background: white;
          color: black;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .left-controls, .right-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .trailer-metadata {
          padding: 1.5rem;
        }

        .trailer-metadata h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .t-meta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .t-studio {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-weight: 600;
        }

        .t-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--surface-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }

        .t-stats {
          font-size: 0.9rem;
          color: var(--grey);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .premiere-badge.inline {
          position: relative;
          top: 0; left: 0;
        }

      `}</style>
    </div>
  );
}
