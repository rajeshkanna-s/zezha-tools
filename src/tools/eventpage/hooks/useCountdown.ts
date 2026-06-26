import { useState, useEffect } from 'react';

export function useCountdown(targetDate: string) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        const target = new Date(targetDate).getTime();
        if (isNaN(target)) return;

        const tick = () => {
            const diff = target - Date.now();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                mins: Math.floor((diff / (1000 * 60)) % 60),
                secs: Math.floor((diff / 1000) % 60),
            });
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return timeLeft;
}
