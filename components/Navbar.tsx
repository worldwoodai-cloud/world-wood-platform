'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Search, Bell, User as UserIcon, LogOut, LayoutDashboard,
  ChevronRight, Rocket, UserCircle, Heart, ThumbsUp,
  CreditCard, Moon, Sun, Monitor, Languages, Globe, Settings, HelpCircle, MessageSquare, Keyboard, Shield,
  Calendar, Compass, Users, Check, ArrowLeft, Zap, Eye
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'comments'>('all');
  const [subMenu, setSubMenu] = useState<string | null>(null);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('English');
  const [restricted, setRestricted] = useState(false);
  const [location, setLocation] = useState('India');
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [hasStudio, setHasStudio] = useState(false);

  useEffect(() => {
    async function checkStudio() {
      if (!user) {
        setHasStudio(false);
        return;
      }
      
      let found = false;

      // 1. Check profile role directly
      if (profile?.role === 'studio') {
        found = true;
      }

      // 2. Check local demo storage
      if (!found && typeof window !== 'undefined') {
        const demoStudios = JSON.parse(localStorage.getItem('nexa-demo-studios') || '[]');
        const isDemoOwner = demoStudios.some((s: any) => s.id === user.id || s.owner_id === user.id);
        if (isDemoOwner) found = true;
      }

      // Check Supabase for a real studio record
      if (!found && user.id) {
        try {
          const supabase = (await import('@/lib/supabase')).createClient();
          const { data } = await supabase
            .from('studios')
            .select('id')
            .eq('owner_id', user.id)
            .maybeSingle();
          if (data) found = true;
        } catch (e: any) {
          // Silently ignore lock/network errors during hot-reload
          if (!e?.message?.includes('AbortError') && !e?.message?.includes('Lock')) {
            console.warn('Studio check failed:', e?.message);
          }
        }
      }
      
      setHasStudio(found);
    }
    checkStudio();
  }, [user, profile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowMenu(false);
        setSubMenu(null);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !showSearch && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeMenu = () => { setShowMenu(false); setSubMenu(null); };

  const languagesList = ['English', 'Hindi', 'Spanish', 'French', 'Japanese', 'Korean', 'German', 'Portuguese', 'Arabic', 'Chinese'];
  const locationsList = ['India', 'United States', 'United Kingdom', 'Japan', 'Germany', 'France', 'South Korea', 'Brazil', 'Canada', 'Australia'];
  const shortcutsList = [
    { key: '/', label: 'Search' },
    { key: 'Shift+N', label: 'Next film' },
    { key: 'Shift+P', label: 'Previous film' },
    { key: 'F', label: 'Fullscreen' },
    { key: 'M', label: 'Mute / Unmute' },
    { key: 'Space', label: 'Play / Pause' },
    { key: 'Esc', label: 'Close overlay' },
    { key: '?', label: 'Show shortcuts' },
  ];

  // ── Inline style objects (avoids styled-jsx scoping issues) ──
  const S = {
    subPanel: { animation: 'nxSlideIn 0.15s ease-out' } as React.CSSProperties,
    subBack: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, color: 'white', width: '100%', textAlign: 'left' as const, cursor: 'pointer', background: 'none', border: 'none' },
    divider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.3rem 0' },
    subDesc: { padding: '0.5rem 1.5rem 0.8rem', fontSize: '0.75rem', color: '#888', lineHeight: 1.5, margin: 0 },
    subHint: { padding: '0.8rem 1.5rem 1rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5, margin: 0 },
    menuGroup: { padding: '0.2rem 0' },
    menuItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem 1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', width: '100%', textAlign: 'left' as const, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'none' },
    menuItemActive: { background: 'rgba(255,27,28,0.08)' },
    chevron: { marginLeft: 'auto' },
    checkmark: { marginLeft: 'auto', color: 'var(--accent)' },
    toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' },
    toggleSwitch: (on: boolean) => ({ width: '40px', height: '22px', borderRadius: '11px', background: on ? 'var(--accent)' : 'rgba(255,255,255,0.15)', position: 'relative' as const, cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0, border: 'none' }),
    toggleKnob: (on: boolean) => ({ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute' as const, top: '2px', left: '2px', transition: 'transform 0.3s', transform: on ? 'translateX(18px)' : 'none' }),
    shortcutRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1.5rem', fontSize: '0.8rem' },
    kbd: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' },
    accountCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 1.5rem' },
    accountInfo: { display: 'flex', flexDirection: 'column' as const, gap: '0.15rem' },
    roleBadge: { display: 'inline-block', marginTop: '0.3rem', fontSize: '0.6rem', fontWeight: 900, background: 'rgba(255,27,28,0.15)', color: 'var(--accent)', padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: '1px', width: 'fit-content' },
    statRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.5rem', fontSize: '0.8rem' },
    statLabel: { color: '#888', fontWeight: 600 },
    statVal: { color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' },
    emptyState: { textAlign: 'center' as const, padding: '2rem 1.5rem', color: '#888' },
    feedbackTa: { width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem', color: 'white', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'vertical' as const, marginBottom: '1rem', minHeight: '80px', outline: 'none' },
    helpVer: { padding: '0.8rem 1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '0.2rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' },
  };

  const renderSubMenu = () => {
    if (subMenu === 'appearance') {
      const themes = [
        { id: 'dark', label: 'Dark theme', icon: <Moon size={18} /> },
        { id: 'light', label: 'Light theme', icon: <Sun size={18} /> },
        { id: 'device', label: 'Use device theme', icon: <Monitor size={18} /> },
      ];
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Appearance</button>
          <div style={S.divider}></div>
          <p style={S.subDesc}>Setting applies to this device only</p>
          <div style={S.menuGroup}>
            {themes.map(t => (
              <button key={t.id} style={{ ...S.menuItem, ...(theme === t.id ? S.menuItemActive : {}) }} onClick={() => setTheme(t.id)}>
                {t.icon} {t.label} {theme === t.id && <Check size={14} style={S.checkmark} />}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (subMenu === 'language') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Display language</button>
          <div style={S.divider}></div>
          <p style={S.subDesc}>Choose your preferred language for the World Wood interface</p>
          <div style={{ ...S.menuGroup, maxHeight: '300px', overflowY: 'auto' }}>
            {languagesList.map(lang => (
              <button key={lang} style={{ ...S.menuItem, ...(language === lang ? S.menuItemActive : {}) }} onClick={() => { setLanguage(lang); setSubMenu(null); }}>
                {lang} {language === lang && <Check size={14} style={S.checkmark} />}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (subMenu === 'restricted') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Restricted Mode</button>
          <div style={S.divider}></div>
          <p style={S.subDesc}>Restricted Mode helps screen out potentially mature content. It uses AI signals and DCSB ratings to identify content you may want to avoid.</p>
          <div style={S.menuGroup}>
            <div style={S.toggleRow}>
              <span>ACTIVATE RESTRICTED MODE</span>
              <button style={S.toggleSwitch(restricted)} onClick={() => setRestricted(!restricted)}>
                <div style={S.toggleKnob(restricted)}></div>
              </button>
            </div>
          </div>
          <p style={S.subHint}>Restricted mode filters films rated 16+ and 18+ from your browse experience. DCSB-flagged content will also be hidden.</p>
        </div>
      );
    }
    if (subMenu === 'location') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Location</button>
          <div style={S.divider}></div>
          <p style={S.subDesc}>Your location determines which premieres and schedules are shown first</p>
          <div style={{ ...S.menuGroup, maxHeight: '300px', overflowY: 'auto' }}>
            {locationsList.map(loc => (
              <button key={loc} style={{ ...S.menuItem, ...(location === loc ? S.menuItemActive : {}) }} onClick={() => { setLocation(loc); setSubMenu(null); }}>
                {loc} {location === loc && <Check size={14} style={S.checkmark} />}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (subMenu === 'shortcuts') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Keyboard shortcuts</button>
          <div style={S.divider}></div>
          <div style={{ ...S.menuGroup, padding: '0.5rem 0' }}>
            {shortcutsList.map(s => (
              <div key={s.key} style={S.shortcutRow}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</span>
                <kbd style={S.kbd}>{s.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (subMenu === 'account') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> World Wood Account</button>
          <div style={S.divider}></div>
          <div style={S.accountCard}>
            <div className="nx-avatar-lg">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                profile?.display_name?.charAt(0) || 'U'
              )}
            </div>
            <div style={S.accountInfo}>
              <span style={{ fontWeight: 600, fontSize: '1rem', color: 'white' }}>{profile?.display_name || 'User'}</span>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>{profile?.email || 'user@nexa.screen'}</span>
              <span style={S.roleBadge}>{(hasStudio ? 'STUDIO' : profile?.role)?.toUpperCase() || 'AUDIENCE'}</span>
            </div>
          </div>
          <div style={S.divider}></div>
          <div style={S.menuGroup}>
            {[
              { label: 'Member Since', value: '2026' },
              { label: 'Films Watched', value: '0' },
              { label: 'Subscription', value: 'Free Tier' },
            ].map(row => (
              <div key={row.label} style={S.statRow}>
                <span style={S.statLabel}>{row.label}</span>
                <span style={S.statVal}>{row.value}</span>
              </div>
            ))}
            <div style={S.statRow}>
              <span style={S.statLabel}>WOOD Credits</span>
              <span style={{ ...S.statVal, color: 'var(--accent)' }}><Zap size={12} /> 0</span>
            </div>
          </div>
          <div style={S.divider}></div>
          <div style={S.menuGroup}>
            <Link href="/profile/edit" style={S.menuItem} onClick={closeMenu}>
              <UserCircle size={18} /> Edit Profile Details
            </Link>
            {hasStudio ? (
              <Link href="/studio/dashboard" style={S.menuItem} onClick={closeMenu}>
                <LayoutDashboard size={18} /> Manage Studio
              </Link>
            ) : (
              <Link href="/studio/register" style={S.menuItem} onClick={closeMenu}>
                <Rocket size={18} /> Upgrade to Creator
              </Link>
            )}
          </div>
        </div>
      );
    }
    if (subMenu === 'purchases') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Purchases & Memberships</button>
          <div style={S.divider}></div>
          <div style={S.emptyState}>
            <CreditCard size={40} />
            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>No purchases yet</h4>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>Your premium screenings, festival passes, and tips will appear here.</p>
          </div>
          <div style={S.divider}></div>
          <div style={S.menuGroup}>
            <button style={S.menuItem}><Zap size={18} /> Buy WOOD Credits</button>
            <button style={S.menuItem}><Eye size={18} /> Browse Premium Screenings</button>
          </div>
        </div>
      );
    }
    if (subMenu === 'settings') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Settings</button>
          <div style={S.divider}></div>
          <div style={S.menuGroup}>
            <button style={S.menuItem} onClick={() => setSubMenu('appearance')}><Moon size={18} /> Appearance <ChevronRight size={14} style={S.chevron} /></button>
            <button style={S.menuItem} onClick={() => setSubMenu('language')}><Languages size={18} /> Language <ChevronRight size={14} style={S.chevron} /></button>
            <button style={S.menuItem} onClick={() => setSubMenu('location')}><Globe size={18} /> Location <ChevronRight size={14} style={S.chevron} /></button>
            <button style={S.menuItem} onClick={() => setSubMenu('restricted')}><Shield size={18} /> Restricted Mode <ChevronRight size={14} style={S.chevron} /></button>
          </div>
          <div style={S.divider}></div>
          <div style={S.menuGroup}>
            {['Autoplay', 'Notifications', 'Sound Effects'].map(label => (
              <div key={label} style={S.toggleRow}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                <button style={S.toggleSwitch(true)}>
                  <div style={S.toggleKnob(true)}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (subMenu === 'help') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Help</button>
          <div style={S.divider}></div>
          <div style={S.menuGroup}>
            <button style={S.menuItem}><HelpCircle size={18} /> Getting Started Guide</button>
            <button style={S.menuItem}><MessageSquare size={18} /> Contact Support</button>
            <Link href="/standards" style={S.menuItem} onClick={closeMenu}><Shield size={18} /> DCSB Standards & Policies</Link>
            <button style={S.menuItem} onClick={() => setSubMenu('shortcuts')}><Keyboard size={18} /> Keyboard Shortcuts <ChevronRight size={14} style={S.chevron} /></button>
          </div>
          <div style={S.divider}></div>
          <div style={S.menuGroup}>
            <div style={S.helpVer}>
              <span>WORLD WOOD v1.0.0</span>
              <span>© 2026 WORLD WOOD</span>
            </div>
          </div>
        </div>
      );
    }
    if (subMenu === 'feedback') {
      return (
        <div style={S.subPanel}>
          <button style={S.subBack} onClick={() => setSubMenu(null)}><ArrowLeft size={16} /> Send Feedback</button>
          <div style={S.divider}></div>
          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            <p style={S.subDesc}>Help us improve WORLD WOOD. Your feedback goes directly to our team.</p>
            <textarea style={S.feedbackTa} placeholder="Describe your experience, report a bug, or suggest a feature..." rows={4}></textarea>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.8rem' }} onClick={() => { alert('Thank you for your feedback!'); setSubMenu(null); }}>Submit Feedback</button>
          </div>
        </div>
      );
    }
    return null;
  };

  // ── Main menu items ──
  const renderMainMenu = () => (
    <>
      <div style={{ display: 'flex', gap: '1rem', padding: '1.2rem 1.5rem' }}>
        <div className="nx-avatar-lg">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            profile?.display_name?.charAt(0) || 'U'
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <span style={{ fontWeight: 600, fontSize: '1rem', color: 'white' }}>{profile?.display_name || 'User'}</span>
          <span style={{ fontSize: '0.85rem', color: '#888' }}>@{profile?.display_name?.toLowerCase().replace(/\s+/g, '')}</span>
          <Link href={hasStudio ? "/studio/dashboard" : "/studio/register"} style={{ fontSize: '0.85rem', color: '#3ea6ff', marginTop: '0.5rem', textDecoration: 'none' }} onClick={closeMenu}>
            {hasStudio ? 'View your studio' : 'Start your studio'}
          </Link>
          {profile?.role === 'admin' && (
            <Link href="/admin/dcsb" style={{ fontSize: '0.85rem', color: '#00ff88', marginTop: '0.4rem', fontWeight: 800, textDecoration: 'none' }} onClick={closeMenu}>
              Admin Review Board
            </Link>
          )}
          <Link href="/profile" style={{ fontSize: '0.75rem', color: '#ff1b1c', marginTop: '0.4rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'none' }} onClick={closeMenu}>
            View your profile
          </Link>
        </div>
      </div>
      <div style={S.divider}></div>
    </>
  );

  // ── Search Logic & Data ──
  const searchMockData = [
    { id: 'omega', type: 'Film', title: 'The Omega Point', subtitle: 'Sci-Fi & Future', url: '/films/omega', img: '/scifi-hall.png' },
    { id: 'hollow', type: 'Film', title: 'The Hollow', subtitle: 'Horror', url: '/films/horror', img: '/horror-hall.png' },
    { id: 'scifi', type: 'Hall', title: 'Sci-Fi & Future', subtitle: 'Digital Cinema Hall', url: '/halls/scifi', img: '/scifi-hall.png' },
    { id: 'action', type: 'Hall', title: 'Action & Spectacle', subtitle: 'Digital Cinema Hall', url: '/halls/action', img: '/action-hall.png' },
    { id: 'neon', type: 'Studio', title: 'Neon Frontier Studios', subtitle: 'Verified Producer', url: '/studios/demo-1', img: 'https://api.dicebear.com/7.x/initials/svg?seed=NFS' },
    { id: 'midnight', type: 'Studio', title: 'Midnight Reel Co.', subtitle: 'Verified Producer', url: '/studios/demo-2', img: 'https://api.dicebear.com/7.x/initials/svg?seed=MRC' },
  ];

  const searchResults: any[] = searchQuery.trim() === '' 
    ? searchMockData.slice(0, 3) 
    : searchMockData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const SearchOverlay = () => (
    <div className="search-overlay">
      <div className="search-backdrop" onClick={() => { setShowSearch(false); setSearchQuery(''); }}></div>
      <div className="search-modal glass">
        <div className="search-input-wrapper">
          <Search size={22} className="search-icon" />
          <input 
            autoFocus 
            placeholder="Search films, halls, studios..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-kbd">
            <kbd>ESC</kbd> to close
          </div>
        </div>
        
        <div className="search-results-container">
          <div className="results-header">
            <span>{searchQuery === '' ? 'Trending searches' : 'Results'}</span>
          </div>
          
          <div className="results-list custom-scrollbar">
            {searchResults.length > 0 ? (
              searchResults.map((item: any) => (
                <Link key={item.id} href={item.url} className="result-item" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                  <img src={item.img} alt="" />
                  <div className="result-info">
                    <span className="result-type">{item.type}</span>
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                  <ChevronRight size={18} className="result-arrow" />
                </Link>
              ))
            ) : (
                <div className="no-results">
                    <Search size={32} />
                    <h3>No results found</h3>
                    <p>Try a different search term</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Secondary menu items ──
  const renderSecondaryMenu = () => (
    <>
      {/* Account */}
      <div style={S.menuGroup}>
        <button style={S.menuItem} onClick={() => setSubMenu('account')}><UserCircle size={18} /> Account <ChevronRight size={14} style={S.chevron} /></button>
        <button onClick={() => { signOut(); closeMenu(); }} style={{ ...S.menuItem, color: 'rgba(255,255,255,0.9)' }}>
          <LogOut size={18} /> Sign out
        </button>
      </div>
      <div style={S.divider}></div>

      {/* Studio/Purchases */}
      <div style={S.menuGroup}>
        <Link href="/studio/dashboard" style={S.menuItem} onClick={closeMenu}>
          <LayoutDashboard size={18} /> {hasStudio ? 'Manage Studio' : 'WW Studio'}
        </Link>
        <button style={S.menuItem} onClick={() => setSubMenu('purchases')}><CreditCard size={18} /> Purchases & memberships <ChevronRight size={14} style={S.chevron} /></button>
      </div>
      <div style={S.divider}></div>

      {/* Preferences */}
      <div style={S.menuGroup}>
        <button style={S.menuItem} onClick={() => setSubMenu('appearance')}>
          <Moon size={18} /> Appearance: {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'Device'} <ChevronRight size={14} style={S.chevron} />
        </button>
        <button style={S.menuItem} onClick={() => setSubMenu('language')}>
          <Languages size={18} /> Language: {language} <ChevronRight size={14} style={S.chevron} />
        </button>
        <button style={S.menuItem} onClick={() => setSubMenu('restricted')}>
          <Shield size={18} /> Restricted Mode: {restricted ? 'On' : 'Off'} <ChevronRight size={14} style={S.chevron} />
        </button>
        <button style={S.menuItem} onClick={() => setSubMenu('location')}>
          <Globe size={18} /> Location: {location} <ChevronRight size={14} style={S.chevron} />
        </button>
      </div>
      <div style={S.divider}></div>

      {/* Settings */}
      <div style={S.menuGroup}>
        <button style={S.menuItem} onClick={() => setSubMenu('settings')}><Settings size={18} /> Settings <ChevronRight size={14} style={S.chevron} /></button>
      </div>
      <div style={S.divider}></div>

      {/* Help & Feedback */}
      <div style={S.menuGroup}>
        <button style={S.menuItem} onClick={() => setSubMenu('help')}><HelpCircle size={18} /> Help <ChevronRight size={14} style={S.chevron} /></button>
        <button style={S.menuItem} onClick={() => setSubMenu('feedback')}><MessageSquare size={18} /> Send feedback <ChevronRight size={14} style={S.chevron} /></button>
      </div>
    </>
  );

  return (
    <nav className="navbar-fixed-nx">
      <div className="navbar-container-nx">
        <div className="navbar-logo-nx">
          <Link href="/">
            <span className="logo-main-nx">WORLD<span className="logo-sub-nx">WOOD</span></span>
          </Link>
        </div>

        <div className="navbar-utilities-nx">
          <div className="navbar-links-nx nav-desktop-only">
            <Link href="/feed">Feed</Link>
            <Link href="/shorts">Shorts</Link>
            <Link href="/map">Map</Link>
            <Link href="/schedule">Schedule</Link>
            <Link href="/studios">Studios</Link>
            <Link href="/standards">DCSB</Link>
          </div>

          <div className="navbar-actions-nx">
            <button className="nav-icon-nx" onClick={() => setShowSearch(true)}>
              <Search size={20} />
            </button>
            <button className="nav-icon-nx" ref={menuRef} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
            </button>
            
            {user ? (
               <button className="nav-avatar-nx" onClick={() => setShowMenu(!showMenu)}>
                  <div className="avatar-circle-nx">
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : <span>{profile?.display_name?.charAt(0) || 'U'}</span>}
                  </div>
               </button>
            ) : (
              <Link href="/auth" className="nav-signin-btn-nx">
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── User Menu Dropdown ── */}
      {showMenu && user && (
        <div
          ref={userMenuRef}
          style={{
            position: 'fixed',
            top: '90px',
            right: '2rem',
            width: '360px',
            background: 'rgba(10,10,10,0.98)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            zIndex: 99999,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 110px)',
          }}
        >
          {subMenu ? renderSubMenu() : (
            <>
              {renderMainMenu()}
              {renderSecondaryMenu()}
            </>
          )}
        </div>
      )}

      {/* ── Search Overlay ── */}
      {showSearch && <SearchOverlay />}

      <style jsx>{`
        .navbar-fixed-nx {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 90px;
          background: rgba(5, 5, 5, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 9999;
          display: flex;
          align-items: center;
        }

        .navbar-container-nx {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo-nx {
          flex-shrink: 0;
        }

        .logo-main-nx {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 1.8rem;
          color: white;
          letter-spacing: -0.02em;
        }

        .logo-sub-nx {
          color: #FF1B1C;
          font-weight: 300;
        }

        .navbar-utilities-nx {
          display: flex;
          align-items: center;
          gap: 3rem;
        }

        .navbar-links-nx {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .navbar-links-nx a {
          color: #a1a1a1;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: 0.3s;
        }

        .navbar-links-nx a:hover {
          color: white;
        }

        .navbar-actions-nx {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-icon-nx {
          background: none;
          border: none;
          color: #a1a1a1;
          cursor: pointer;
          transition: 0.3s;
        }

        .nav-icon-nx:hover {
          color: white;
        }

        .nav-signin-btn-nx {
          background: #FF1B1C;
          color: white;
          padding: 0.8rem 2rem;
          font-weight: 950;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          border-radius: 4px;
          clip-path: polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%);
          transition: 0.3s;
        }

        .nav-signin-btn-nx:hover {
          background: white;
          color: black;
          transform: translateY(-2px);
        }

        .nav-avatar-nx {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .avatar-circle-nx {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          background: #111;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF1B1C;
          font-weight: 900;
        }

        .avatar-circle-nx img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 1024px) {
          .nav-desktop-only {
            display: none;
          }
          .navbar-container-nx {
            padding: 0 2rem;
          }
        }
      `}</style>
    </nav>
  );
}

