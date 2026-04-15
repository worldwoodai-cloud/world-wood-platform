'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Film, FileText, CheckCircle, Loader2, Play, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';


export default function UploadPage() {
    const { profile, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [file, setFile] = useState<File | null>(null);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(1);
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    // Dynamic data
    const [halls, setHalls] = useState<any[]>([]);
    const [studioId, setStudioId] = useState<string | null>(null);
    const [hasStudio, setHasStudio] = useState(false);
    const [isChecking, setIsChecking] = useState(true);


    // Form states
    const [title, setTitle] = useState('');
    const [hallId, setHallId] = useState('');
    const [description, setDescription] = useState('');
    const [runtime, setRuntime] = useState('0');
    const [posterUrl, setPosterUrl] = useState('');
    const [trailerUrl, setTrailerUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [aiTools, setAiTools] = useState('');


    useEffect(() => {
        async function checkStudioAccess() {
            if (authLoading) return;
            
            if (!user) {
                router.push('/auth');
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

            // 3. Check Supabase - Only if NOT a demo user
            if (!found && user.id && !user.id.includes('demo')) {
                try {
                    const { data } = await supabase
                        .from('studios')
                        .select('id')
                        .eq('owner_id', user.id)
                        .maybeSingle();
                    
                    if (data) found = true;
                } catch (e) {
                    console.error("Studio detection error in upload:", e);
                }
            }

            if (!found) {
                router.push('/studio/register');
            } else {
                setHasStudio(true);
                fetchInitialData();
            }
            setIsChecking(false);
        }
        checkStudioAccess();
    }, [user, profile, authLoading, router]);

    const fetchInitialData = async () => {
        // Fetch Halls
        const { data: hallsData } = await supabase.from('halls').select('id, name');
        
        let availableHalls = hallsData || [];
        
        // Fallback to default halls if DB is empty
        if (availableHalls.length === 0) {
            availableHalls = [
                { id: 'hall-1', name: 'Sci-Fi & Future' },
                { id: 'hall-2', name: 'Fantasy & Myth' },
                { id: 'hall-3', name: 'Documentary & Truth' },
                { id: 'hall-4', name: 'Action & Kinetic' },
                { id: 'hall-5', name: 'Horror & Thriller' },
                { id: 'hall-6', name: 'Experimental & Shorts' }
            ];
        }
        
        setHalls(availableHalls);
        setHallId(availableHalls[0].id);

        // Fetch user's studio ID
        const { data: studioData } = await supabase
            .from('studios')
            .select('id')
            .eq('owner_id', user?.id)
            .single();

        if (studioData) setStudioId(studioData.id);
    };


    if (authLoading || isChecking) return <div className="loading">Loading creator workspace...</div>;
    if (!hasStudio) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setStep(2);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studioId) return alert("Studio record not found. Please register as a studio first.");

        setUploading(true);
        setProgress(10);
        setFormError('');

        try {
            const filmSlug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
            const isDemo = user?.id?.includes('demo');
            let publicPosterUrl = '';

            if (isDemo) {
                // Mock poster URL
                publicPosterUrl = `https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800`;
                setProgress(60);

                // Save to demo films
                const demoFilms = JSON.parse(localStorage.getItem('nexa-demo-films') || '[]');
                const newFilm = {
                    id: `demo-film-${Date.now()}`,
                    studio_id: studioId,
                    hall_id: hallId,
                    title: title,
                    slug: `${filmSlug}-${Math.floor(Math.random() * 1000)}`,
                    description: description,
                    poster_url: publicPosterUrl,
                    trailer_url: videoUrl,
                    status: 'pending',
                    created_at: new Date().toISOString()
                };
                localStorage.setItem('nexa-demo-films', JSON.stringify([...demoFilms, newFilm]));
                setProgress(100);
            } else {
                // 1. Upload Poster to Supabase Storage
                if (posterFile) {
                    const fileExt = posterFile.name.split('.').pop();
                    const fileName = `${Date.now()}-poster.${fileExt}`;
                    const filePath = `${user!.id}/${fileName}`;

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('films')
                        .upload(filePath, posterFile);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('films')
                        .getPublicUrl(filePath);
                    
                    publicPosterUrl = publicUrl;
                    setProgress(60);
                }

                // 2. Insert into Supabase Table
                const { error: dbError } = await supabase
                    .from('films')
                    .insert([
                        {
                            studio_id: studioId,
                            hall_id: hallId,
                            title: title,
                            slug: `${filmSlug}-${Math.floor(Math.random() * 1000)}`,
                            description: description,
                            poster_url: publicPosterUrl,
                            trailer_url: videoUrl,
                            status: 'pending' // Admin must approve
                        }
                    ]);

                if (dbError) throw dbError;
                setProgress(100);
            }
            setUploading(false);
            setStep(3);
        } catch (err: any) {
            console.error('Submission failed:', err);
            setFormError("Error: " + (err.message || 'Check your Supabase policies'));
            setUploading(false);
        }
    };


    const genres = [
        "Sci-Fi & Future",
        "Fantasy & Myth",
        "Experimental & Shorts",
        "Cyberpunk",
        "Horror & Dark Cinema",
        "Digital Documentary"
    ];

    return (
        <div className="upload-page">
            <div className="container">
                <header className="upload-header">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        New Cinema <span className="accent-text">Submission</span>
                    </motion.h1>
                    <p>Submit your digital masterpiece to the Digital Cinema Standards Board (DCSB).</p>
                </header>

                <div className="upload-container glass">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="step-content select-file"
                            >
                                <div
                                    className="drop-zone"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const droppedFile = e.dataTransfer.files?.[0];
                                        if (droppedFile) {
                                            setFile(droppedFile);
                                            setStep(2);
                                        }
                                    }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        hidden
                                    />
                                    <div className="upload-icon-box">
                                        <Upload size={64} className="upload-icon" />
                                    </div>
                                    <h2>Drag & Drop your Film File</h2>
                                    <p>MP4, MOV, or WEBM (Max 2GB recommended)</p>
                                    <button className="btn-primary">Browse Files</button>
                                </div>
                                <div className="standards-reminder">
                                    <Info size={18} />
                                    <span>All submissions must comply with NEXA SCREEN’s AI Ethics policy.</span>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="step-content film-details"
                            >
                                <div className="details-header">
                                    <div className="file-info">
                                        <Film size={24} className="accent-text" />
                                        <span>{file?.name}</span>
                                        <button className="remove-btn" onClick={() => setStep(1)}><X size={16} /></button>
                                    </div>
                                    <div className="step-indicator">Step 2 of 2: Classification Details</div>
                                </div>

                                <form onSubmit={handleUpload} className="details-form">
                                    <div className="form-grid">
                                        <div className="form-left">
                                            <div className="input-group">
                                                <label>FILM TITLE</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your film's title"
                                                    required
                                                    value={title}
                                                    onChange={e => setTitle(e.target.value)}
                                                />
                                            </div>

                                            <div className="input-group">
                                                <label>TARGET HALL (GENRE)</label>
                                                <select value={hallId} onChange={e => setHallId(e.target.value)} required>
                                                    <option value="">Select a Hall</option>
                                                    {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                                </select>
                                            </div>

                                            <div className="input-group">
                                                <label>RUNTIME (MINUTES)</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 15"
                                                    value={runtime}
                                                    onChange={e => setRuntime(e.target.value)}
                                                />
                                            </div>


                                            <div className="input-group">
                                                <label>DESCRIPTION / SYNOPSIS</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder="Briefly describe the world and story of your film..."
                                                    value={description}
                                                    onChange={e => setDescription(e.target.value)}
                                                ></textarea>
                                            </div>

                                        </div>

                                        <div className="form-right">
                                            <div className="input-group">
                                                <label>VISUAL ASSETS</label>
                                                <div className="upload-btn-group">
                                                    <input type="file" ref={posterInputRef} hidden accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setPosterFile(e.target.files[0]) }} />
                                                    <button type="button" className={`image-upload-btn ${posterFile ? 'selected' : ''}`} onClick={() => posterInputRef.current?.click()}>
                                                        {posterFile ? <><CheckCircle size={18} color="#00ff88" /> {posterFile.name}</> : <><Upload size={18} /> Add Poster</>}
                                                    </button>

                                                    <input type="file" ref={thumbnailInputRef} hidden accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setThumbnailFile(e.target.files[0]) }} />
                                                    <button type="button" className={`image-upload-btn ${thumbnailFile ? 'selected' : ''}`} onClick={() => thumbnailInputRef.current?.click()}>
                                                        {thumbnailFile ? <><CheckCircle size={18} color="#00ff88" /> {thumbnailFile.name}</> : <><Upload size={18} /> Add Thumbnail</>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="input-group">
                                                <label>AI ETHICS & TOOLS USED</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="E.g. Midjourney for concepts, Kling for generation, Magnific for upscaling..."
                                                    value={aiTools}
                                                    onChange={e => setAiTools(e.target.value)}
                                                ></textarea>
                                                <p className="hint">Transparency helps the DCSB audit process.</p>
                                            </div>


                                            <div className="input-group">
                                                <label>ADD GOOGLE DRIVE OR MEGA LINK</label>
                                                <input
                                                    type="url"
                                                    placeholder="Google Drive, Mega, or Dropbox link"
                                                    value={videoUrl}
                                                    onChange={e => setVideoUrl(e.target.value)}
                                                />
                                                <p className="hint">Provide a link to your full, high-quality film file.</p>
                                            </div>


                                        </div>
                                    </div>

                                    <div className="form-footer">
                                        <div className="ethics-checkpoint glass">
                                            <AlertCircle size={24} className="accent-text" />
                                            <div className="checkpoint-text">
                                                <h4>DCSB Pledge</h4>
                                                <p>I confirm this film contains no unauthorized identities and adheres to NEXA's Cinema Standards.</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                            {formError && (
                                                <div className="error-msg" style={{ color: 'var(--accent)', background: 'rgba(255,27,28,0.1)', padding: '0.8rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                                                    {formError}
                                                </div>
                                            )}
                                            <div className="form-actions">
                                                <button type="button" className="btn-glass" onClick={() => setStep(1)}>Cancel</button>
                                                <button type="submit" className="btn-primary" disabled={uploading}>
                                                    {uploading ? (
                                                        <><Loader2 className="animate-spin" size={18} /> Uploading {Math.round(progress)}%</>
                                                    ) : (
                                                        <>Submit for DCSB Review</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="step-content success-state"
                            >
                                <div className="success-icon-box">
                                    <CheckCircle size={80} className="success-icon" />
                                </div>
                                <h2>Film Successfully Submitted!</h2>
                                <p>Your film <strong>"{title}"</strong> has been queued for DCSB Audit. You will receive an official classification within 24-48 hours.</p>

                                <div className="next-steps">
                                    <button
                                        className="btn-primary"
                                        onClick={() => router.push('/studio/dashboard')}
                                    >
                                        Back to Dashboard
                                    </button>
                                    <button
                                        className="btn-glass"
                                        onClick={() => {
                                            setStep(1);
                                            setFile(null);
                                            setPosterFile(null);
                                            setThumbnailFile(null);
                                            setTitle('');
                                            setDescription('');
                                            setAiTools('');
                                        }}
                                    >
                                        Submit Another Film
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .upload-page { padding-top: 154px; padding-bottom: 100px; min-height: 100vh; }
                .upload-header { margin-bottom: 4rem; }
                .upload-header h1 { font-size: 3.5rem; font-weight: 950; text-transform: uppercase; margin-bottom: 0.5rem; }
                .upload-header p { color: var(--grey); font-size: 1.2rem; }

                .upload-container { border-radius: 24px; min-height: 600px; padding: 4rem; position: relative; }
                .step-content { display: flex; flex-direction: column; height: auto; min-height: 400px; justify-content: center; }

                /* Step 1 */
                .drop-zone { flex: 1; border: 2px dashed rgba(255,255,255,0.1); border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; transition: var(--transition); cursor: pointer; min-height: 400px; background: rgba(0,0,0,0.2); }
                .drop-zone:hover { background: rgba(255, 27, 28, 0.03); border-color: var(--accent); }
                .upload-icon-box { width: 100px; height: 100px; background: rgba(255, 27, 28, 0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent); margin-bottom: 1rem; }
                .drop-zone h2 { font-size: 1.8rem; font-weight: 900; }
                .drop-zone p { color: var(--grey); font-size: 1rem; }

                .standards-reminder { margin-top: 2rem; display: flex; align-items: center; gap: 1rem; color: var(--grey); font-size: 0.85rem; font-weight: 600; justify-content: center; padding: 1.5rem; background: rgba(255,255,255,0.02); border-radius: 12px; }


                /* Step 2 */
                .details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid var(--glass-border); }
                .file-info { display: flex; align-items: center; gap: 1rem; font-weight: 800; }
                .remove-btn { color: var(--grey); transition: var(--transition); }
                .remove-btn:hover { color: var(--accent); }
                .step-indicator { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); }

                .details-form { display: flex; flex-direction: column; gap: 3rem; }
                .form-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 4rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; }
                .input-group label { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: var(--grey); }
                .input-group input, .input-group select, .input-group textarea { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); padding: 1.2rem; border-radius: 12px; color: white; font-weight: 600; transition: var(--transition); font-family: inherit; font-size: 0.95rem; }
                .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: var(--accent); outline: none; background: rgba(0,0,0,0.6); box-shadow: 0 0 15px rgba(255,27,28,0.1); }
                .hint { font-size: 0.75rem; color: var(--grey); margin-top: 0.2rem; font-style: italic; }


                .ethics-checkpoint { padding: 1.5rem; border-radius: 16px; display: flex; gap: 1rem; align-items: center; max-width: 60%; }
                .checkpoint-text h4 { font-size: 0.95rem; font-weight: 950; margin-bottom: 0.2rem; }
                .checkpoint-text p { font-size: 0.85rem; color: var(--grey); line-height: 1.4; margin: 0; }

                .form-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 3rem; gap: 2rem; }
                .form-actions { display: flex; gap: 1rem; align-items: center; }
                .btn-mini { padding: 0.5rem 1rem; }

                /* Step 3 */
                .success-state { align-items: center; justify-content: center; text-align: center; gap: 2rem; padding: 6rem; }
                .success-icon-box { color: #00ff88; margin-bottom: 1rem; }
                .success-state h2 { font-size: 3rem; font-weight: 950; }
                .success-state p { font-size: 1.2rem; color: var(--grey); max-width: 600px; line-height: 1.6; }
                .next-steps { display: flex; gap: 2rem; margin-top: 2rem; }

                .upload-btn-group { display: flex; flex-direction: column; gap: 1rem; }
                .image-upload-btn { background: rgba(0,0,0,0.4); border: 2px dashed rgba(255,255,255,0.15); padding: 1.2rem; border-radius: 12px; color: var(--grey); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.8rem; cursor: pointer; transition: var(--transition); width: 100%; font-family: inherit; }
                .image-upload-btn:hover { border-color: var(--accent); color: white; background: rgba(255,27,28,0.05); }
                .image-upload-btn.selected { border-color: #00ff88; border-style: solid; color: white; background: rgba(0, 255, 136, 0.05); }

                @media (max-width: 1024px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .upload-header h1 { font-size: 2.5rem; }
                    .upload-container { padding: 2rem; }
                }
            `}</style>
        </div>
    );
}
