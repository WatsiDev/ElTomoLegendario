import React, { useState, useEffect, useRef } from 'react';

interface ChampionData {
  slug: string;
  name: string;
  image: string;
}

interface SearchBarProps {
  champs: ChampionData[];
}

export default function SearchBar({ champs }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ChampionData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = champs.filter((champ) => 
        champ.name.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 8); // limit top 8 results
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, champs]);

  return (
    <div ref={wrapperRef} className="relative w-full md:w-64">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim().length > 1) setIsOpen(true) }}
          placeholder="Buscar campeón..."
          className="w-full bg-black/50 text-gray-200 border border-gray-700/50 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-raid-gold focus:ring-1 focus:ring-raid-gold transition-all text-sm placeholder:text-gray-500 backdrop-blur-sm"
        />
        <svg
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-raid-card border border-gray-700 rounded-lg shadow-2xl overflow-hidden max-h-80 overflow-y-auto custom-scrollbar">
          <ul>
            {results.map((champ) => (
              <li key={champ.slug}>
                <a
                  href={`/campeon/${champ.slug}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors border-b border-gray-700/50 last:border-0 group"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 shrink-0 group-hover:border-raid-gold transition-colors">
                    <img 
                      src={champ.image} 
                      alt={champ.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-semibold text-gray-300 group-hover:text-raid-gold transition-colors text-sm">
                    {champ.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-raid-card border border-gray-700 rounded-lg shadow-xl p-4 text-center">
          <p className="text-gray-400 text-sm">No se encontraron campeones.</p>
        </div>
      )}
    </div>
  );
}
