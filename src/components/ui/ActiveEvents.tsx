import React, { useState, useEffect } from "react";

interface GlobalEvent {
    name: string;
    "start-date"?: string;
    "end-date"?: string;
    [key: string]: any;
}

interface ActiveEventsProps {
    events?: GlobalEvent[];
}

const parseEventDate = (dateStr?: string) => {
    if (!dateStr) return 0;
    
    // Formato DD.MM.YYYY
    let match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (match) {
        // Asumiendo que el evento termina al final del día (23:59:59)
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]), 23, 59, 59).getTime();
    }
    
    // Formato YYYY-MM-DD
    match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), 23, 59, 59).getTime();
    }
    
    // Si tiene otro formato, como ISO, lo parsea directamente
    return new Date(dateStr).getTime();
};

const getTimeLeft = (endTime: number, nowTime: number) => {
    const total = endTime - nowTime;
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    return { days, hours, minutes, seconds };
};

export default function ActiveEvents({ events = [] }: ActiveEventsProps) {
    const [now, setNow] = useState(Date.now());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return <div className="text-xs sm:text-sm text-gray-400">Cargando eventos...</div>;
    }

    // Filtrar los eventos activos
    const filteredEvents = events.filter((event) => {
        const startTime = parseEventDate(event["start-date"]);
        const endTime = parseEventDate(event["end-date"]);
        
        let status = "EXPIRED";
        if (now < startTime) {
            status = "UPCOMING";
        } else if (now >= startTime && now <= endTime) {
            status = "ACTIVE";
        }
        
        return status === "ACTIVE";
    });

    if (filteredEvents.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {filteredEvents.map((event, index) => {
                const endTime = parseEventDate(event["end-date"]);
                const timeLeft = getTimeLeft(endTime, now);

                return (
                    <div key={index} className="flex items-center gap-2 text-xs sm:text-sm font-medium z-50 relative">
                        <span className="text-raid-gold drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]">🔥 {event.name}:</span>
                        <div className="flex space-x-1 lg:space-x-1.5 border border-raid-gold/30 bg-raid-gold/10 px-2 py-0.5 rounded text-gray-200">
                            {timeLeft.days > 0 && (
                                <span className="w-auto min-w-4 text-center pr-1">{timeLeft.days}d</span>
                            )}
                            <span className="w-5 text-center">{timeLeft.hours.toString().padStart(2, '0')}h</span>
                            <span className="w-6 text-center">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
                            <span className="w-6 text-center text-raid-gold">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
