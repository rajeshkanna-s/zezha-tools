/**
 * Reusable subscription status display helper.
 * Returns { label, color } for consistent display across the app.
 */

interface Subscription {
  plan_name: string;
  status: string;
  expires_at: string | null;
  trial_ends_at: string | null;
}

interface StatusDisplay {
  label: string;
  colorClass: string; // Tailwind class
}

export function getSubscriptionStatusDisplay(sub: Subscription | null): StatusDisplay {
  if (!sub) {
    return { label: 'No Plan', colorClass: 'text-slate-500' };
  }

  const now = new Date();

  // Free trial
  if (sub.plan_name === 'free_trial') {
    const end = sub.trial_ends_at ? new Date(sub.trial_ends_at) : sub.expires_at ? new Date(sub.expires_at) : null;
    if (end && end > now) {
      const hoursLeft = (end.getTime() - now.getTime()) / 3600000;
      if (hoursLeft < 24) {
        const h = Math.floor(hoursLeft);
        return { label: `Free Trial (3-Day) — ${h} hour${h !== 1 ? 's' : ''} left`, colorClass: 'text-amber-600' };
      }
      const daysLeft = Math.floor(hoursLeft / 24);
      return { label: `Free Trial (3-Day) — ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`, colorClass: 'text-amber-600' };
    }
    return { label: 'Trial Expired', colorClass: 'text-red-600' };
  }

  // Expired
  if (sub.status === 'expired' || (sub.expires_at && new Date(sub.expires_at) < now)) {
    return { label: 'Expired', colorClass: 'text-red-600' };
  }

  // Active paid plan
  const planLabels: Record<string, string> = {
    monthly: 'Monthly Plan',
    '3_month': '3 Month Plan',
    '6_month': '6 Month Plan',
    '1_year': '1 Year Plan',
    '2_year': '2 Year Plan',
  };
  const planLabel = planLabels[sub.plan_name] || sub.plan_name;

  if (sub.expires_at) {
    const daysLeft = Math.floor((new Date(sub.expires_at).getTime() - now.getTime()) / 86400000);
    return { label: `${planLabel} — ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`, colorClass: 'text-emerald-600' };
  }

  return { label: `${planLabel} — Active`, colorClass: 'text-emerald-600' };
}
