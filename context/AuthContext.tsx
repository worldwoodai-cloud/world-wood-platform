'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    profile: any | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchProfileData = async (userId: string, userEmail?: string) => {
        const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (!error && profileData) {
            setProfile(profileData);
        } else {
            // Auto-create profile if trigger didn't fire
            const fallbackName = userEmail ? userEmail.split('@')[0] : 'User';
            const { data: newProfile } = await supabase
                .from('profiles')
                .insert([{ id: userId, display_name: fallbackName }])
                .select()
                .single();
            if (newProfile) setProfile(newProfile);
        }
    };

    const refreshProfile = async () => {
        try {
            // Check demo session first
            if (typeof window !== 'undefined') {
                const demoData = localStorage.getItem('nexa-demo-session');
                if (demoData) {
                    const parsed = JSON.parse(demoData);
                    setProfile(parsed);
                    // Also ensure user is set
                    if (!user) {
                        setUser({
                            id: parsed.id || 'demo-admin-id',
                            email: 'admin@worldwood.ai',
                            user_metadata: { full_name: parsed.display_name, role: parsed.role },
                            aud: 'authenticated',
                            role: 'authenticated',
                            app_metadata: {},
                            created_at: new Date().toISOString(),
                        } as any);
                    }
                    return;
                }
            }

            // Real Supabase
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchProfileData(session.user.id);
            }
        } catch (err) {
            console.error('Refresh profile error:', err);
        }
    };

    useEffect(() => {
        const getSession = async () => {
            // Check for demo session first
            if (typeof window !== 'undefined') {
                const demoData = localStorage.getItem('nexa-demo-session');
                if (demoData) {
                    const parsed = JSON.parse(demoData);
                    setUser({
                        id: parsed.id || 'demo-admin-id',
                        email: 'admin@worldwood.ai',
                        user_metadata: { full_name: parsed.display_name, role: parsed.role },
                        aud: 'authenticated',
                        role: 'authenticated',
                        app_metadata: {},
                        created_at: new Date().toISOString(),
                    } as any);
                    setProfile(parsed);
                    setLoading(false);
                    return;
                }
            }

            // Fall through to real Supabase auth
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfileData(session.user.id, session.user.email);
                }
            } catch (err) {
                console.error('Auth session error:', err);
            }
            setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            // Only update if not in demo mode
            if (typeof window !== 'undefined' && localStorage.getItem('nexa-demo-session')) return;

            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfileData(session.user.id, session.user.email);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
