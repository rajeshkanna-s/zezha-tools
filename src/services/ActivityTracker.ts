/* ═══════════════════════════════════════════════════════════════
   ActivityTracker — tracks tool usage events in localStorage
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'riq-activity-log';
const MAX_EVENTS = 500; // Cap to prevent storage bloat

export interface ActivityEvent {
  toolId: string;
  toolName: string;
  sectionId?: string;
  sectionName?: string;
  timestamp: number; // epoch ms
}

export interface UsageStat {
  toolId: string;
  toolName: string;
  count: number;
  lastUsed: number;
}

export interface ActivityStats {
  totalUsages: number;
  todayUsages: number;
  weekUsages: number;
  monthUsages: number;
  uniqueToolsUsed: number;
  mostUsed: UsageStat[];      // top 10
  recentActivity: ActivityEvent[]; // last 20
  currentStreak: number;       // consecutive days with usage
  memberSince: number | null;  // first recorded event timestamp
}

class ActivityTrackerService {
  private getEvents(): ActivityEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveEvents(events: ActivityEvent[]) {
    // Keep only the latest MAX_EVENTS
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  /** Record a tool usage event */
  trackUsage(toolId: string, toolName: string, sectionId?: string, sectionName?: string) {
    const events = this.getEvents();
    // Debounce: don't record same tool within 5 seconds
    const lastEvent = events[events.length - 1];
    if (lastEvent && lastEvent.toolId === toolId && Date.now() - lastEvent.timestamp < 5000) {
      return;
    }
    events.push({
      toolId,
      toolName,
      sectionId,
      sectionName,
      timestamp: Date.now(),
    });
    this.saveEvents(events);
  }

  /** Get comprehensive stats */
  getStats(): ActivityStats {
    const events = this.getEvents();
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setDate(monthStart.getDate() - 30);

    const todayMs = todayStart.getTime();
    const weekMs = weekStart.getTime();
    const monthMs = monthStart.getTime();

    // Counts
    let todayUsages = 0;
    let weekUsages = 0;
    let monthUsages = 0;

    // Tool frequency map
    const toolMap = new Map<string, UsageStat>();

    // Unique days set (for streak calculation)
    const usedDays = new Set<string>();

    for (const ev of events) {
      if (ev.timestamp >= todayMs) todayUsages++;
      if (ev.timestamp >= weekMs) weekUsages++;
      if (ev.timestamp >= monthMs) monthUsages++;

      const existing = toolMap.get(ev.toolId);
      if (existing) {
        existing.count++;
        existing.lastUsed = Math.max(existing.lastUsed, ev.timestamp);
      } else {
        toolMap.set(ev.toolId, {
          toolId: ev.toolId,
          toolName: ev.toolName,
          count: 1,
          lastUsed: ev.timestamp,
        });
      }

      // Track unique days
      const dayKey = new Date(ev.timestamp).toISOString().split('T')[0];
      usedDays.add(dayKey);
    }

    // Most used tools (top 10)
    const mostUsed = Array.from(toolMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity (last 20, newest first)
    const recentActivity = [...events].reverse().slice(0, 20);

    // Current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dayKey = checkDate.toISOString().split('T')[0];
      if (usedDays.has(dayKey)) {
        currentStreak++;
      } else if (i > 0) {
        break; // Streak broken (skip today check for flexibility)
      }
    }

    return {
      totalUsages: events.length,
      todayUsages,
      weekUsages,
      monthUsages,
      uniqueToolsUsed: toolMap.size,
      mostUsed,
      recentActivity,
      currentStreak,
      memberSince: events.length > 0 ? events[0].timestamp : null,
    };
  }

  /** Clear all activity data */
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const activityTracker = new ActivityTrackerService();
