import React, { useState, useEffect } from 'react';
import promoData from '@data/live-ops/promo-codes/promo-codes.json';

// Utilidad para parsear ambas opciones: DD.MM.YYYY o YYYY-MM-DD
const parsePromoDate = (dateStr: string) => {
    if (!dateStr) return 0;
    
    // Formato DD.MM.YYYY
    let match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (match) {
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1])).getTime();
    }
    
    // Formato YYYY-MM-DD
    match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3])).getTime();
    }
    
    return new Date(dateStr).getTime();
};

export default function PromoCodeBtn() {
    const [copied, setCopied] = useState(false);
    const [latestCode, setLatestCode] = useState<string | null>(null);

    useEffect(() => {
        // Toleramos +24h en el futuro (86400000ms) para evitar que desaparezca por diferencias de zona horaria el mismo día.
        const maxValidTime = Date.now() + 86400000; 

        const validCodes = (promoData.promo_codes || []).filter(p => {
            if (!p.active || p['account-type'] !== 'all') return false;
            const releaseTime = parsePromoDate(p['release-date']);
            return releaseTime <= maxValidTime;
        });

        if (validCodes.length > 0) {
            validCodes.sort((a, b) => {
                return parsePromoDate(b['release-date']) - parsePromoDate(a['release-date']);
            });
            setLatestCode(validCodes[0].code);
        }
    }, []);

    if (!latestCode) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(latestCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error al copiar: ", err);
        }
    };

    return (
        <button 
            onClick={handleCopy}
            className="flex items-center gap-2 group cursor-pointer transition-colors relative" 
            title="Click para copiar" 
            aria-label="Copiar código promocional"
        >
            <span className="text-gray-400 text-xs sm:text-sm font-semibold">Nuevo Código:</span>
            <div className="relative flex items-center justify-center">
                <div className="bg-raid-bg border border-raid-purple/50 px-3 py-0.5 rounded-full text-raid-purple font-bold tracking-wider group-hover:bg-raid-purple/20 group-hover:border-raid-purple transition-all shadow-[0_0_8px_rgba(168,85,247,0.2)] text-xs sm:text-sm flex items-center gap-2">
                    <span>{latestCode}</span>
                    {!copied ? (
                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    ) : (
                        <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    )}
                </div>
                {/* Tooltip feedback */}
                <span className={`absolute -top-8 bg-gray-800 border border-gray-600 text-green-400 text-[10px] sm:text-xs px-2 py-1 rounded transition-all duration-300 shadow-lg pointer-events-none transform whitespace-nowrap ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    ¡Copiado!
                </span>
            </div>
        </button>
    );
}
