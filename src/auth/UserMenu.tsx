import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, CreditCard, Lock, LogOut, ChevronDown, FileSpreadsheet, Settings } from 'lucide-react';

interface UserMenuProps {
  onAccount: (tab?: string) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onAccount }) => {
  const auth = useAuth() as any;
  const { profile, user, signOut, subscription } = auth;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const openedAtRef = useRef<number>(0);

  // Calculate dropdown position when opening
  const updateDropdownPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 224; // w-56 = 14rem = 224px

      // Ensure dropdown doesn't overflow right edge
      let right = viewportWidth - rect.right;
      if (right < 8) right = 8;

      // Ensure dropdown doesn't overflow left edge
      const left = viewportWidth - right - dropdownWidth;
      if (left < 8) {
        right = viewportWidth - dropdownWidth - 8;
      }

      setDropdownStyle({
        position: 'fixed' as const,
        top: rect.bottom + 8,
        right: Math.max(8, right),
        zIndex: 9999,
      });
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      // Ignore events that fire within 200ms of opening (prevents race condition on mobile)
      if (Date.now() - openedAtRef.current < 200) return;
      // Don't close if tapping on the toggle button itself (it handles its own toggle)
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) return;
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  // Update position when scrolling or resizing while open
  useEffect(() => {
    if (!open) return;
    updateDropdownPosition();
    const onScroll = () => updateDropdownPosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, updateDropdownPosition]);

  const handleToggle = () => {
    if (!open) {
      updateDropdownPosition();
      openedAtRef.current = Date.now();
    }
    setOpen(!open);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  const getSubBadge = () => {
    if (!subscription) return null;
    if (subscription.plan_name === 'free_trial') {
      const end = subscription.trial_ends_at ? new Date(subscription.trial_ends_at) : null;
      if (!end || end.getTime() <= Date.now()) return <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">Expired</span>;
      const hoursLeft = (end.getTime() - Date.now()) / 3600000;
      const display = hoursLeft < 24 ? `${Math.floor(hoursLeft)}h` : `${Math.floor(hoursLeft / 24)}d`;
      return <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Trial: {display}</span>;
    }
    if (subscription.status === 'active') return <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Pro</span>;
    return null;
  };

  return (
    <div ref={ref} className="relative">
      <button ref={buttonRef} onClick={handleToggle} className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation min-h-[40px]">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">{displayName}</span>
        {getSubBadge()}
        <ChevronDown size={14} className={`text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[9998] md:hidden" onClick={() => setOpen(false)} />
      )}

      {open && (
        <div
          style={dropdownStyle}
          className="w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 animate-fade-in"
        >
          <div className="px-4 py-3 border-b border-slate-100 mb-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate" title={displayName}>{displayName}</p>
            <p className="text-xs text-slate-400 truncate" title={user?.email}>{user?.email}</p>
            {user?.last_sign_in_at && (
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                Last login: {new Date(user.last_sign_in_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </div>
          <button onClick={() => { setOpen(false); onAccount('profile'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary active:bg-primary/10 transition-colors">
            <User size={16} /> Edit Profile
          </button>
          <button onClick={() => { setOpen(false); onAccount('subscription'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary active:bg-primary/10 transition-colors">
            <CreditCard size={16} /> Manage Subscription
          </button>
          <button onClick={() => { setOpen(false); onAccount('password'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary active:bg-primary/10 transition-colors">
            <Lock size={16} /> Change Password
          </button>
          <button onClick={() => { setOpen(false); onAccount('files'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary active:bg-primary/10 transition-colors">
            <FileSpreadsheet size={16} /> File History
          </button>
          <button onClick={() => { setOpen(false); onAccount('settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary active:bg-primary/10 transition-colors">
            <Settings size={16} /> Settings
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button onClick={() => { setOpen(false); signOut(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors font-medium">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
