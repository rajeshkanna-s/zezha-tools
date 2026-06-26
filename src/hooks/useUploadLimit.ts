import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ─── Tool names (must match DB structure) ────────────────────────────────────
export type ToolName = 'business_intelligence' | 'category_reports' | 'bank_statement';

async function getMonthlyLimit(planId: string | undefined): Promise<number> {
    const plan = planId || 'free_trial'; // default fallback

    const { data, error } = await supabase
        .from('plans')
        .select('upload_limit')
        .eq('id', plan)
        .maybeSingle();

    if (error) {
        console.error('Failed to fetch plan limit:', error);
        return 250; // default safe fallback if query fails
    }

    return data?.upload_limit ?? 250;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useUploadLimit() {
    const { user, subscription } = useAuth();

    /**
     * Get current month's upload count and limit for a specific tool.
     * Returns { used, limit, remaining, allowed }
     */
    const checkLimit = useCallback(async (tool: ToolName): Promise<{
        used: number;
        limit: number;
        remaining: number;
        allowed: boolean;
    }> => {
        if (!user) return { used: 0, limit: 0, remaining: 0, allowed: false };

        // subscription?.plan_name might actually be plan_id in the DB logic or we use subscription.id
        // In the database schemas, usually subscription.plan_name stores the 'id' of the plan (e.g. 'free_trial')
        const limit = await getMonthlyLimit(subscription?.plan_name);

        // Fetch user's row containing counts
        const { data, error } = await supabase
            .from('file_upload_usage')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            console.error('Upload limit check failed:', error);
            // On error, allow upload but log it (don't block users due to DB issues)
            return { used: 0, limit, remaining: limit, allowed: true };
        }

        let used = 0;
        if (data) {
            // Check if last_reset_month matches current month
            const now = new Date();
            const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
            const dbMonthStr = data.last_reset_month ? String(data.last_reset_month) : '';
            const dbMonth = dbMonthStr.length >= 7 ? dbMonthStr.substring(0, 7) : '';

            // If it's the same month, use the stored count. Otherwise, treating it as 0
            if (currentMonth === dbMonth) {
                // Safely cast data to access dynamic tool keys
                const usageData = data as unknown as Record<string, number | null>;
                used = Number(usageData[tool]) || 0;
            }
        }

        const remaining = Math.max(0, limit - used);
        return { used, limit, remaining, allowed: remaining > 0 };
    }, [user, subscription]);

    /**
     * Record a successful file upload for a tool.
     * Call this AFTER the file has been successfully processed.
     */
    const recordUpload = useCallback(async (tool: ToolName): Promise<boolean> => {
        if (!user) return false;

        const now = new Date();
        const currentMonthDb = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;

        // Fetch current counts
        const { data: currentData, error: fetchError } = await supabase
            .from('file_upload_usage')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Failed to fetch existing upload counts:', fetchError);
        }

        let newCounts: Record<ToolName, number> = {
            business_intelligence: 0,
            category_reports: 0,
            bank_statement: 0,
        };

        if (currentData) {
            const dbMonthStr = currentData.last_reset_month ? String(currentData.last_reset_month) : '';
            const dbMonth = dbMonthStr.length >= 7 ? dbMonthStr.substring(0, 7) : '';
            const currentMonthStr = currentMonthDb.substring(0, 7);

            // Inherit old counts ONLY if it's the same month
            if (dbMonth === currentMonthStr) {
                newCounts = {
                    business_intelligence: Number(currentData.business_intelligence) || 0,
                    category_reports: Number(currentData.category_reports) || 0,
                    bank_statement: Number(currentData.bank_statement) || 0,
                };
            }
        }

        // Increment the specific tool
        newCounts[tool] += 1;

        const { error } = await supabase
            .from('file_upload_usage')
            .upsert({
                user_id: user.id,
                ...newCounts,
                last_reset_month: currentMonthDb,
            }, { onConflict: 'user_id' });

        if (error) {
            console.error('Failed to record upload:', error);
            return false;
        }
        return true;
    }, [user]);

    /**
     * Combined: check limit → if allowed, record the upload.
     * Returns { allowed, used, limit, remaining, message }
     */
    const checkAndRecord = useCallback(async (tool: ToolName): Promise<{
        allowed: boolean;
        used: number;
        limit: number;
        remaining: number;
        message: string;
    }> => {
        const status = await checkLimit(tool);

        if (!status.allowed) {
            const planLabel = subscription?.plan_name === 'free_trial' ? 'Free Trial' : 'your plan';
            return {
                ...status,
                allowed: false,
                message: `Monthly upload limit reached (${status.used}/${status.limit} for ${planLabel}). Please upgrade your plan for more uploads.`,
            };
        }

        // Record the upload
        const success = await recordUpload(tool);

        if (!success) {
            return {
                ...status,
                allowed: true, // we still let them proceed if db logging fails
                message: `Upload successful, but usage logging failed.`,
            };
        }

        const newUsed = status.used + 1;
        const newRemaining = Math.max(0, status.limit - newUsed);
        return {
            allowed: true,
            used: newUsed,
            limit: status.limit,
            remaining: newRemaining,
            message: `Upload ${newUsed}/${status.limit} this month. ${newRemaining} remaining.`,
        };
    }, [checkLimit, recordUpload, subscription]);

    return { checkLimit, recordUpload, checkAndRecord };
}
