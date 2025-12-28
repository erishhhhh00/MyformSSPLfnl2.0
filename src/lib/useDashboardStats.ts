import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './api';
import { supabase } from './supabase';

/**
 * Custom hook for dashboard stats with Supabase real-time subscriptions
 * 
 * Single Source of Truth:
 * - UID-level counts from uids.status
 * - Student-level counts from students.status
 * - No frontend caching - fresh queries on every refresh
 */
export interface DashboardStats {
    // UID Stats
    total_uids: number;
    pending_count: number;
    assessor_started_count: number;
    user_submitted_count: number;
    ready_for_moderation_count: number;
    moderation_complete_count: number;
    sent_to_admin_count: number;
    approved_count: number;
    // Combined metrics
    with_assessor_count: number;
    with_moderator_count: number;
    // Student Stats
    total_students: number;
    students_pending_moderation: number;
    students_moderated: number;
    students_sent_to_admin: number;
    students_approved: number;
    students_rejected: number;
}

const defaultStats: DashboardStats = {
    total_uids: 0,
    pending_count: 0,
    assessor_started_count: 0,
    user_submitted_count: 0,
    ready_for_moderation_count: 0,
    moderation_complete_count: 0,
    sent_to_admin_count: 0,
    approved_count: 0,
    with_assessor_count: 0,
    with_moderator_count: 0,
    total_students: 0,
    students_pending_moderation: 0,
    students_moderated: 0,
    students_sent_to_admin: 0,
    students_approved: 0,
    students_rejected: 0
};

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats>(defaultStats);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debounce timer ref to prevent multiple rapid refreshes
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const lastFetchRef = useRef<number>(0);

    // Fetch stats from server (READ-ONLY, no caching)
    const fetchStats = useCallback(async () => {
        try {
            setError(null);
            const serverStats = await api.getStats();
            setStats(serverStats);
        } catch (e) {
            console.error('Failed to fetch stats:', e);
            setError('Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced refresh to prevent multiple rapid updates (300ms)
    const refreshStats = useCallback(() => {
        const now = Date.now();

        // If less than 300ms since last fetch, debounce
        if (now - lastFetchRef.current < 300) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
                lastFetchRef.current = Date.now();
                fetchStats();
            }, 300);
            return;
        }

        lastFetchRef.current = now;
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        // Initial fetch
        fetchStats();

        // Subscribe to Supabase real-time changes on uids table
        const uidsChannel = supabase
            .channel('uids-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'uids' },
                () => {
                    console.log('🔄 Supabase: uids table changed');
                    refreshStats();
                }
            )
            .subscribe();

        // Subscribe to Supabase real-time changes on students table
        const studentsChannel = supabase
            .channel('students-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'students' },
                () => {
                    console.log('🔄 Supabase: students table changed');
                    refreshStats();
                }
            )
            .subscribe();

        // Cleanup on unmount
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            supabase.removeChannel(uidsChannel);
            supabase.removeChannel(studentsChannel);
        };
    }, [fetchStats, refreshStats]);

    return { stats, loading, error, refreshStats };
}

export default useDashboardStats;
