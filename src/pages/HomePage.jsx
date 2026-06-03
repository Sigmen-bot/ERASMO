import { useState, useRef } from 'react';
// IMPORTUJEMY NASZE GOTOWE KOMPONENTY
import SearchPage from './SearchPage';
import GoErasmusPage from './GoErasmusPage';
import tloGora from '../assets/grafika1.svg';

const noiseTexture = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

export default function HomePage() {
  const formularzRef = useRef(null);
  const [tryb, setTryb] = useState('szukaj'); // domyślnie lewy przycisk

  // Magia płynnego przewijania
  const zmienTrybIScrolluj = (nowyTryb) => {
    setTryb(nowyTryb);
    setTimeout(() => {
      formularzRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="w-full flex flex-col font-sans bg-white">
      
      {/* 1. SEKCJA HERO NA CAŁY EKRAN */}
      <section className="w-full max-w-6xl mx-auto px-4 md:px-12 pt-16 pb-20 flex flex-col items-center">
        <div className="text-center flex flex-col items-center mb-10">
          <span className="text-purple-600 text-[10px] font-black tracking-[0.2em] uppercase mb-4">Twój kompas na Erasmusie</span>
          <h1 className="text-5xl md:text-[3.5rem] font-black text-gray-900 leading-[1.1] tracking-tight max-w-3xl">
            Zorganizuj swój wyjazd<br />bez zbędnego stresu.
          </h1>
        </div>

        <div className="w-full h-64 md:h-80 rounded-[2.5rem] bg-gradient-to-br from-[#2470ff] via-[#2470ff] to-[#a420eb] via-[70%] relative overflow-hidden flex items-center justify-end px-8 md:px-16 shadow-lg mb-10">
          <div className="absolute inset-0 opacity-[0.45] mix-blend-overlay pointer-events-none" style={{ backgroundImage: noiseTexture }}></div>
          <div className="absolute inset-0 bg-cover bg-left opacity-30 pointer-events-none" style={{ backgroundImage: `url(${tloGora})` }}></div>
          <h2 className="relative z-10 text-white font-extrabold text-4xl md:text-[3.5rem] text-right leading-tight tracking-wide drop-shadow-sm">
            TWOJA PODRÓŻ<br/>CZEKA
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            type="button"
            onClick={() => zmienTrybIScrolluj('szukaj')}
            className={`text-xs font-black uppercase tracking-widest px-8 py-5 rounded-xl transition-all shadow-md border-2 ${tryb === 'szukaj' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 hover:border-black'}`}
          >
            Znajdź wymarzonego Erasmusa
          </button>
          <button 
            type="button"
            onClick={() => zmienTrybIScrolluj('zakwalifikowany')}
            className={`text-xs font-black uppercase tracking-widest px-8 py-5 rounded-xl transition-all shadow-md border-2 ${tryb === 'zakwalifikowany' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 hover:border-black'}`}
          >
            Jestem już zakwalifikowany/a
          </button>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
          Dołącz do 1000+ studentów, którzy uprościli swój learning agreement
        </p>
      </section>

      {/* 2. PRZYWRÓCONA SEKCJA INFORMACYJNA */}
      <section className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-24 flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black text-purple-600 uppercase leading-[1.1] tracking-tight">
              Zaplanuj swoją<br/>mobilność
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-col gap-6 text-gray-600 font-medium text-lg leading-relaxed">
            <p>
              Stworzyliśmy narzędzie dla studentów i każdej społeczności związanej z programem Erasmus+.
            </p>
            <p>
              Naszym celem jest uproszczenie procesu tworzenia Learning Agreement poprzez automatyzację najważniejszych etapów i ograniczenie problemów związanych z wyszukiwaniem sylabusów, doborem przedmiotów i niejasnymi informacjami.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PRZYWRÓCONA SEKCJA STATYSTYK */}
      <section className="w-full border-t border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-[#a420eb]">100+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Zaktualizowanych<br/>sylabusów</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-[#a420eb]">1000+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Dopasowań</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-[#a420eb]">10+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Kierunków studiów</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-[#a420eb]">50+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Krajów</span>
          </div>
        </div>
      </section>

      {/* 4. SEKCJA Z IMPORTOWANYMI FORMULARZAMI (Cel Scrollowania) */}
      <section ref={formularzRef} className="w-full bg-gray-50/50 border-t border-gray-100 py-24 scroll-mt-8">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          
          {/* Tuta dzieje się magia: AI wrzuca odpowiedni plik */}
          {tryb === 'szukaj' ? <SearchPage /> : <GoErasmusPage />}
          
        </div>
      </section>

    </div>
  );
}