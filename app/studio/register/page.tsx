'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { Rocket, Shield, Film, Layout, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { triggerWelcomeEmail } from '@/app/actions/email';

const supabase = createClient();

export default function StudioRegister() {
    const { user, profile } = useAuth();
    const router = useRouter();
    // ... rest same ...

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slug: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormError('');

        try {
            const studioId = user?.id || `demo-studio-${Date.now()}`;
            const isDemo = user?.id?.includes('demo');
            
            // 1. Create the studio (Supabase) - ONLY if not demo
            if (!isDemo) {
                const { data: studio, error: studioError } = await supabase
                    .from('studios')
                    .insert([
                        {
                            owner_id: user?.id,
                            name: formData.name,
                            description: formData.description
                        }
                    ])
                    .select()
                    .single();

                if (studioError) {
                    if (studioError.code === '23505') { // Unique violation / already exists
                        setSuccess(true);
                        setTimeout(() => { window.location.href = '/studio/dashboard'; }, 1000);
                        return;
                    }
                    throw studioError;
                }

                // 2. Update user profile role to 'studio' (Supabase)
                if (user?.id) {
                    await supabase
                        .from('profiles')
                        .update({ role: 'studio' })
                        .eq('id', user.id);
                }
            }

            // 2.5 Trigger Welcome Email
            if (user?.email) {
                await triggerWelcomeEmail(user.email, formData.name);
            }

            // 3. Local Storage Persistence for ALL users (works as cache for real, and primary for demo)
            if (typeof window !== 'undefined') {
                const demoStudios = JSON.parse(localStorage.getItem('nexa-demo-studios') || '[]');
                const newStudio = {
                    id: studioId,
                    name: formData.name,
                    description: formData.description,
                    verified: true,
                    filmCount: 0,
                    followers: '0',
                    genre: 'General',
                    logo: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=F11B1C`,
                    banner: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
                    location: 'New Earth',
                    founded: new Date().getFullYear().toString(),
                };
                
                // Avoid duplicates
                const filtered = demoStudios.filter((s: any) => s.id !== studioId);
                localStorage.setItem('nexa-demo-studios', JSON.stringify([...filtered, newStudio]));
            }

            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/studio/dashboard';
            }, 1000);
        } catch (err: any) {
            console.error('Registration error:', err);
            setFormError("Creation failed: " + (err.message || 'Network error'));
        } finally {
            setLoading(false);
        }

    };

    if (success) {
        return (
            <div className="register-page">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="success-card glass"
                >
                    <CheckCircle size={64} color="var(--accent)" />
                    <h1>Studio Created!</h1>
                    <p>Welcome to the WORLD WOOD Creator community. Redirecting to your dashboard...</p>
                </motion.div>
                <style jsx>{`
                    .register-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--background); }
                    .success-card { padding: 4rem; text-align: center; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
                    h1 { font-weight: 900; font-size: 2.5rem; }
                    p { color: var(--grey); }
                `}</style>
            </div>
        );
    }

    return (
        <div className="register-page">
            <div className="container">
                <div className="register-grid">
                    <div className="info-side">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <span className="badge"><Rocket size={14} /> Creator Program</span>
                            <h1>Launch Your <br /><span className="accent-text">Virtual Studio</span></h1>
                            <p className="main-desc"> WORLD WOOD provides the infrastructure for AI-native filmmakers to distribute, premiere, and monetize their work in a cinematic environment.</p>

                            <div className="perks">
                                <div className="perk">
                                    <Shield className="accent-text" />
                                    <div>
                                        <h4>Verified Status</h4>
                                        <p>Get the red checkmark for your studio.</p>
                                    </div>
                                </div>
                                <div className="perk">
                                    <Film className="accent-text" />
                                    <div>
                                        <h4>Global Premieres</h4>
                                        <p>Schedule live screenings in our Halls.</p>
                                    </div>
                                </div>
                                <div className="perk">
                                    <Layout className="accent-text" />
                                    <div>
                                        <h4>Creator Analytics</h4>
                                        <p>Track audience engagement and revenue.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="form-side">
                        <form onSubmit={handleSubmit} className="glass registration-form">
                            <div className="form-header">
                                <h3>Studio Profile</h3>
                                <p>This information will be visible to the WORLD WOOD audience.</p>
                            </div>


                            <div className="input-field">
                                <label>Studio Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cybernetic Arts"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="input-field">
                                <label>Studio Handle (Slug)</label>
                                <div className="slug-input">
                                    <span>worldwood.com/studio/</span>
                                    <input
                                        type="text"
                                        placeholder="cyber-cinema"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Studio Bio</label>
                                <textarea
                                    placeholder="Tell the world about your cinematic vision..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {formError && (
                                <div className="error-msg" style={{ 
                                    color: 'var(--accent)', 
                                    background: 'rgba(255,27,28,0.1)', 
                                    padding: '1rem', 
                                    borderRadius: '8px', 
                                    fontSize: '0.85rem', 
                                    fontWeight: '600',
                                    marginBottom: '1rem' 
                                }}>
                                    {formError}
                                </div>
                            )}

                            <button type="submit" className="btn-primary full-btn" disabled={loading}>
                                {loading ? 'Initializing...' : 'Launch Studio'}
                            </button>
                            <p className="terms">By launching, you agree to WORLD WOOD Creator Standards.</p>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .register-page {
                    min-height: 100vh;
                    padding: 120px 0 60px;
                    background: radial-gradient(circle at top right, #1a0505 0%, #050505 100%);
                }
                .register-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6rem;
                    align-items: center;
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255,27,28,0.1);
                    color: var(--accent);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                }
                h1 { font-size: 4rem; font-weight: 900; line-height: 1; margin-bottom: 1.5rem; }
                .main-desc { font-size: 1.2rem; color: var(--grey); margin-bottom: 3rem; line-height: 1.6; }
                
                .perks { display: flex; flex-direction: column; gap: 2rem; }
                .perk { display: flex; gap: 1.5rem; }
                .perk h4 { font-size: 1.1rem; margin-bottom: 0.3rem; }
                .perk p { font-size: 0.9rem; color: var(--grey); }

                .registration-form {
                    padding: 4rem;
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.08); /* Lighter border for contrast */
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5); /* Deep shadow */
                }
                .form-header { margin-bottom: 3rem; }
                .form-header h3 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; }
                .form-header p { font-size: 0.9rem; color: var(--grey); }
                
                .input-field { margin-bottom: 2rem; }
                .input-field label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--grey); text-transform: uppercase; margin-bottom: 0.8rem; letter-spacing: 1px; }
                .input-field input, .input-field textarea {
                    width: 100%;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 1.2rem;
                    color: white;
                    font-family: inherit;
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: var(--transition);
                }
                .input-field input:focus, .input-field textarea:focus { border-color: var(--accent); outline: none; background: rgba(0,0,0,0.6); box-shadow: 0 0 15px rgba(255,27,28,0.1); }
                
                .slug-input { display: flex; align-items: center; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding-left: 1.2rem; transition: var(--transition); }
                .slug-input:focus-within { border-color: var(--accent); background: rgba(0,0,0,0.6); }
                .slug-input span { color: var(--grey); font-size: 0.85rem; font-weight: 600; }
                .slug-input input { background: transparent; border: none; padding-left: 0.5rem; }
                .slug-input input:focus { box-shadow: none; }

                
                .full-btn { width: 100%; justify-content: center; padding: 1.2rem; margin-top: 1rem; }
                .terms { text-align: center; color: var(--grey); font-size: 0.75rem; margin-top: 1.5rem; }

                @media (max-width: 968px) {
                    .register-grid { grid-template-columns: 1fr; gap: 4rem; }
                    h1 { font-size: 3rem; }
                }
            `}</style>
        </div>
    );
}
