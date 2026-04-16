import React, { useState, useEffect } from "react";

interface ActiveEventsProps {
    eventName?: string;
    endDate?: string;
}

export default function ActiveEvents({ 
    eventName = "Fusión: Mavara la Pitonisa", 
    endDate 
}: ActiveEventsProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 6, hours: 20, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Simple fallback interval just to tick seconds for now safely
        const timer = setInterval(() => {
            setTimeLeft(prev => ({ ...prev, seconds: prev.seconds > 0 ? prev.seconds - 1 : 59 }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return <div className="text-xs sm:text-sm text-gray-400">Cargando evento...</div>;
    }

    return (
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium z-50 relative">
            <span className="text-raid-gold drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]">🔥 {eventName}:</span>
            <div className="flex space-x-1 lg:space-x-1.5 border border-raid-gold/30 bg-raid-gold/10 px-2 py-0.5 rounded text-gray-200">
                <span className="w-4 text-center">{timeLeft.days}d</span>
                <span className="w-5 text-center">{timeLeft.hours.toString().padStart(2, '0')}h</span>
                <span className="w-6 text-center">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
                <span className="w-6 text-center text-raid-gold">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
            </div>
        </div>
    );
}
