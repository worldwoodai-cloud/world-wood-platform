'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Camera, 
  Shield, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function EditProfilePage() {
    const { user, profile, refreshProfile } = useAuth();
    const router = useRouter();
    const supabase = createClient();
    
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
                const isDemoOwner = demoStudios.some((s: any) => s.owner_id === user.id || s.id === user.id);
                if (isDemoOwner) found = true;
            }

            // 3. Check Supabase - Only if NOT a demo user
            if (!found && user.id && !user.id.includes('demo')) {
                try {
                    const { data, error } = await supabase
                        .from('studios')
                        .select('id')
                        .eq('owner_id', user.id)
                        .maybeSingle();
                    
                    if (data) found = true;
                } catch (e) {
                    console.error("Studio detection error in profile:", e);
                }
            }
            
            setHasStudio(found);
        }
        checkStudio();
    }, [user, profile]);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || '');
            setEmail(profile.email || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const isDemo = user?.id.includes('demo');

            if (isDemo) {
                // For demo: Use reader to get base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setAvatarUrl(base64String);
                    setUploading(false);
                };
                reader.readAsDataURL(file);
            } else {
                // For real users: Upload to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('profiles') // Assuming there's a profiles bucket
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('profiles')
                    .getPublicUrl(filePath);

                setAvatarUrl(publicUrl);
                setUploading(false);
            }
        } catch (err: any) {
            console.error('Avatar upload failed:', err);
            setError('Failed to upload avatar. ' + err.message);
            setUploading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!user) throw new Error("You must be logged in to update your profile.");

            const isDemo = user.id.includes('demo');

            if (!isDemo) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        display_name: displayName,
                        avatar_url: avatarUrl
                    })
                    .eq('id', user.id);

                if (updateError) throw updateError;
            }

            // Update localStorage for demo mode persistence
            const demoSession = localStorage.getItem('nexa-demo-session');
            if (demoSession) {
                const parsed = JSON.parse(demoSession);
                parsed.display_name = displayName;
                parsed.avatar_url = avatarUrl; // Fix: ensure avatar updates in demo session too
                localStorage.setItem('nexa-demo-session', JSON.stringify(parsed));
            }

            await refreshProfile();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error('Profile update failed:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="edit-profile-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Shield size={48} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '1rem' }}>Unauthorized</h2>
                    <p style={{ color: 'var(--grey)', marginBottom: '2rem' }}>Please log in to manage your profile settings.</p>
                    <Link href="/auth" className="btn-primary">Return to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-profile-page">
            <div className="container small-container">
                <header className="page-header">
                    <button onClick={() => router.back()} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <span className="accent-text label">USER SETTINGS</span>
                        <h1 className="title">Edit <span className="accent-text">Profile</span></h1>
                    </div>
                </header>

                <div className="profile-layout">
                    <form onSubmit={handleUpdate} className="glass profile-form">
                        {/* Avatar Section */}
                        <div className="avatar-section">
                            <div className="avatar-preview">
                                <label className="avatar-trigger" title="Upload New Avatar">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="avatar-img" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {displayName.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div className="avatar-overlay">
                                        {uploading ? <Loader2 className="spin" size={24} /> : <Camera size={24} />}
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                            <div className="avatar-info">
                                <h3>Public Avatar</h3>
                                <p>Change your global cinematic identity.</p>
                                <div className="avatar-input-wrapper">
                                    <input 
                                        type="text" 
                                        className="input-field-sm glass" 
                                        placeholder="Or paste an image URL..." 
                                        value={avatarUrl && !avatarUrl.startsWith('data:') ? avatarUrl : ''}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                    />
                                    {avatarUrl?.startsWith('data:') && <span className="upload-indicator">Custom Upload Active</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label><User size={14} /> DISPLAY NAME</label>
                                <input 
                                    type="text" 
                                    className="input-field glass" 
                                    required
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your cinematic name..."
                                />
                                <span className="input-hint">This name will be shown on your certificates and reviews.</span>
                            </div>

                            <div className="form-group disabled">
                                <label><Mail size={14} /> EMAIL ADDRESS</label>
                                <input 
                                    type="email" 
                                    className="input-field glass" 
                                    disabled
                                    value={email}
                                    placeholder="your@email.com"
                                />
                                <span className="input-hint">Email cannot be changed directly for security.</span>
                            </div>
                        </div>

                        <div className="status-messages">
                            {success && (
                                <div className="status-success glass">
                                    <Check size={18} /> Profile updated successfully!
                                </div>
                            )}
                            {error && (
                                <div className="status-error glass">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={loading} className="btn-primary-lg full-width">
                                {loading ? <Loader2 className="spin" size={20} /> : <Check size={20} />}
                                {loading ? 'SAVING CHANGES...' : 'SAVE PROFILE'}
                            </button>
                        </div>
                    </form>

                    <aside className="sidebar">
                        <div className="glass sidebar-card">
                            <div className="card-header">
                                <Shield size={20} />
                                <h3>Security & Privacy</h3>
                            </div>
                            <p>Your data is encrypted using Supabase AES-256 and follows DCSB 2026 digital cinema privacy standards.</p>
                            <div className="divider"></div>
                            <button onClick={() => alert("Verification system coming soon")} className="btn-glass small">
                                <Sparkles size={14} /> Get Verified
                            </button>
                        </div>

                        <div className="glass sidebar-card">
                            <div className="card-header">
                                <Shield size={20} />
                                <h3>Account Role</h3>
                            </div>
                            <div className="role-box">
                                <span className="role-label">CURRENT ROLE</span>
                                <span className="role-val">{(hasStudio || profile?.role === 'studio') ? 'STUDIO' : (profile?.role?.toUpperCase() || 'AUDIENCE')}</span>
                            </div>
                            {(hasStudio || profile?.role === 'studio') ? (
                                <Link href="/studio/dashboard" className="upgrade-link" style={{ color: '#00ff88' }}>
                                    Go to Producer Workspace →
                                </Link>
                            ) : (
                                <Link href="/studio/register" className="upgrade-link">
                                    Apply for Studio Status →
                                </Link>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            <style jsx>{`
                .edit-profile-page {
                    min-height: 100vh;
                    background: #050505;
                    padding-top: 150px;
                    padding-bottom: 200px;
                }
                .small-container {
                    max-width: 1000px;
                }
                .page-header {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 4rem;
                }
                .back-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .back-btn:hover { background: rgba(255,255,255,0.1); border-color: white; transform: translateX(-5px); }

                .label { font-size: 0.75rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 0.5rem; display: block; }
                .title { font-size: 3rem; font-weight: 950; line-height: 1; }

                .profile-layout {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 3rem;
                    align-items: flex-start;
                }

                .profile-form {
                    padding: 3.5rem;
                    border-radius: 32px;
                }

                .avatar-section {
                    display: flex;
                    gap: 2.5rem;
                    margin-bottom: 3.5rem;
                    align-items: center;
                }
                .avatar-preview {
                    position: relative;
                    width: 130px;
                    height: 130px;
                }
                .avatar-trigger {
                    position: relative;
                    display: block;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    border-radius: 38px;
                    overflow: hidden;
                    border: 2px solid var(--glass-border);
                    transition: 0.3s;
                }
                .avatar-trigger:hover {
                    border-color: var(--accent);
                    transform: scale(1.02);
                }
                .avatar-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3.5rem;
                    font-weight: 950;
                    color: white;
                    background: linear-gradient(135deg, #111, #222);
                }
                .avatar-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: 0.3s;
                    backdrop-filter: blur(4px);
                }
                .avatar-trigger:hover .avatar-overlay {
                    opacity: 1;
                }
                .avatar-overlay :global(svg) {
                    color: white;
                    filter: drop-shadow(0 0 10px rgba(255,27,28,0.5));
                }
                
                .avatar-upload { display: none; } /* Disabled old class */

                .avatar-info h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; }
                .avatar-info p { font-size: 0.85rem; color: var(--grey); margin-bottom: 1.2rem; line-height: 1.5; }
                .input-field-sm {
                    width: 100%;
                    padding: 0.8rem 1.2rem;
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                    background: rgba(255,255,255,0.03);
                    color: white;
                    font-size: 0.8rem;
                    outline: none;
                }
                .avatar-input-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .upload-indicator {
                    font-size: 0.65rem;
                    color: #00ff88;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .form-group.disabled { opacity: 0.6; }
                .form-group label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: var(--grey);
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }
                .input-field {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--glass-border);
                    padding: 1.2rem;
                    border-radius: 16px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    outline: none;
                    transition: 0.3s;
                }
                .input-field:focus { border-color: var(--accent); background: rgba(0,0,0,0.5); }
                .input-hint { font-size: 0.7rem; color: #666; font-weight: 600; }

                .status-messages { margin-bottom: 2.5rem; }
                .status-success { background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.2); color: #00ff88; padding: 1.2rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem; font-weight: 700; font-size: 0.9rem; }
                .status-error { background: rgba(255, 27, 28, 0.1); border: 1px solid rgba(255, 27, 28, 0.2); color: #ff1b1c; padding: 1.2rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem; font-weight: 700; font-size: 0.9rem; }

                .btn-primary-lg {
                    background: var(--accent);
                    color: white;
                    border: none;
                    padding: 1.5rem;
                    border-radius: 20px;
                    font-weight: 900;
                    font-size: 1rem;
                    letter-spacing: 2px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    transition: 0.3s;
                }
                .btn-primary-lg:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 15px 30px rgba(255,27,28,0.3); }
                .btn-primary-lg:disabled { opacity: 0.5; cursor: not-allowed; }

                .sidebar { display: flex; flex-direction: column; gap: 2rem; }
                .sidebar-card { padding: 2.5rem; border-radius: 24px; }
                .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: var(--accent); }
                .card-header h3 { font-size: 1rem; font-weight: 900; text-transform: uppercase; color: white; letter-spacing: 1px; }
                .sidebar-card p { font-size: 0.85rem; color: var(--grey); line-height: 1.6; margin-bottom: 1.5rem; }
                
                .divider { height: 1px; background: var(--glass-border); margin: 1.5rem 0; }
                .role-box { background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.4rem; }
                .role-label { font-size: 0.6rem; font-weight: 900; color: var(--grey); letter-spacing: 1px; }
                .role-val { font-size: 1.2rem; font-weight: 950; color: white; }
                .upgrade-link { margin-top: 1.5rem; display: block; color: var(--accent); font-weight: 800; font-size: 0.85rem; text-decoration: none; }
                
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .profile-layout { grid-template-columns: 1fr; }
                    .form-grid { grid-template-columns: 1fr; }
                    .page-header { flex-direction: column; align-items: flex-start; text-align: left; }
                }
            `}</style>
        </div>
    );
}
