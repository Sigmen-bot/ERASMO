import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { calculateOptimalMatches } from '../utils/matchMaker';

import faleDolSvg from '../assets/Grafika3.svg';

const noiseTexture = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const wybranyKierunek = searchParams.get('kierunek');
  const wybranySemestr = searchParams.get('semestr');

  const [rankingUczelni, setRankingUczelni] = useState(null);
  const [czyAnalizuje, setCzyAnalizuje] = useState(true);

  useEffect(() => {
    if (!wybranyKierunek || !wybranySemestr) {
      navigate('/');
      return;
    }

    const generujRanking = async () => {
      try {
        // 1. Pobieramy wszystkie polskie przedmioty dla tego kierunku
        const { data: wybranePrzedmiotyUEK } = await supabase
          .from('przedmioty')
          .select('*')
          .eq('uczelnia_nazwa', 'UEK')
          .eq('kierunek_nazwa', wybranyKierunek) 
          .eq('semestr', wybranySemestr);

        // 2. Pobieramy WSZYSTKIE zagraniczne przedmioty
        const { data: wszystkieZagr } = await supabase
          .from('przedmioty')
          .select('*')
          .neq('uczelnia_nazwa', 'UEK');

        if (!wybranePrzedmiotyUEK || wybranePrzedmiotyUEK.length === 0) {
          setRankingUczelni([]);
          return;
        }

        const uekIds = wybranePrzedmiotyUEK.map(p => p.id);
        const wszystkieZagrIds = wszystkieZagr.map(p => p.id);

        // 3. Pobieramy absolutnie wszystkie dopasowania dla tej puli
        const { data: wszystkieDopasowania, error } = await supabase
          .from('dopasowania')
          .select('*')
          .in('przedmiot_pl_id', uekIds)
          .in('przedmiot_zagr_id', wszystkieZagrIds);

        if (error) throw error;

        // 4. Grupujemy zagraniczne przedmioty na poszczególne uczelnie
        const unikalneUczelnie = [...new Set(wszystkieZagr.map(p => p.uczelnia_nazwa))];
        const wynikiZestawienie = [];

        // 5. Dla każdej uczelni z osobna uruchamiamy nasz potężny algorytm Mózgu
        for (const nazwaUczelni of unikalneUczelnie) {
          const ofertaTejUczelni = wszystkieZagr.filter(p => p.uczelnia_nazwa === nazwaUczelni);
          
          // Odsiewamy tylko dopasowania dotyczące tej konkretnej uczelni
          const dopasowaniaTejUczelni = (wszystkieDopasowania || []).filter(d => 
            ofertaTejUczelni.some(zagr => zagr.id === d.przedmiot_zagr_id)
          );

          // Symulujemy Learning Agreement dla tej uczelni
          const zoptymalizowaneWyniki = calculateOptimalMatches(wybranePrzedmiotyUEK, ofertaTejUczelni, dopasowaniaTejUczelni);

          // Obliczamy średnią arytmetyczną
          let sumaProcentow = 0;
          zoptymalizowaneWyniki.forEach(wynik => {
            sumaProcentow += wynik.zgodnosc; // Np. jeśli nie ma dopasowania, to 0%
          });
          
          const sredniaZgodnosc = Math.round(sumaProcentow / wybranePrzedmiotyUEK.length);

          // Jeśli uczelnia w ogóle coś dopasowała, dodajemy ją do rankingu
          if (sredniaZgodnosc > 0) {
            wynikiZestawienie.push({
              nazwa: nazwaUczelni,
              srednia: sredniaZgodnosc
            });
          }
        }

        // 6. Sortujemy od najlepszego dopasowania
        wynikiZestawienie.sort((a, b) => b.srednia - a.srednia);
        
        setRankingUczelni(wynikiZestawienie);

      } catch (error) {
        console.error("Błąd generowania rankingu:", error);
      } finally {
        setCzyAnalizuje(false);
      }
    };

    generujRanking();
  }, [wybranyKierunek, wybranySemestr, navigate]);

  return (
    <div className="w-full flex flex-col font-sans bg-white min-h-screen">
      
      <div className="max-w-6xl mx-auto w-full px-4 md:px-12 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors mb-12">
          <span>←</span> Wróć do wyszukiwarki
        </Link>

        {czyAnalizuje ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#a420eb] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse">Skanowanie wszystkich uczelni partnerskich...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* LEWA STRONA: LISTA WYNIKÓW (RANKING) */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h1 className="text-3xl font-black text-[#a420eb] uppercase tracking-widest mb-4">
                WYNIKI:
              </h1>
              
              {rankingUczelni && rankingUczelni.length === 0 ? (
                <p className="text-gray-500 italic">Brak jakichkolwiek dopasowań dla tego kierunku w bazie.</p>
              ) : (
                rankingUczelni.map((wynik, index) => (
                  <Link 
                    key={index}
                    // Po kliknięciu w kartę od razu przenosi nas do szczegółów dla tej konkretnej uczelni!
                    to={`/sylabusy?kierunek=${encodeURIComponent(wybranyKierunek)}&semestr=${wybranySemestr}&uczelnia=${encodeURIComponent(wynik.nazwa)}`}
                    className="group bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex items-center justify-between hover:shadow-md hover:border-purple-300 transition-all cursor-pointer"
                  >
                    <span className="font-bold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">
                      {wynik.nazwa}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                        Dopasowanie
                      </span>
                      <span className="text-3xl font-black text-[#a420eb]">
                        {wynik.srednia}%
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* PRAWA STRONA: KWADRATOWY BANER Z FALAMI (Zgodnie z obrazkiem) */}
            <div className="w-full lg:w-1/2 sticky top-32">
              <div className="aspect-square w-full max-w-[500px] mx-auto rounded-[3rem] bg-gradient-to-br from-[#2470ff] via-[#2470ff] to-[#a420eb] via-[70%] relative flex items-center justify-end px-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-[0.45] mix-blend-overlay pointer-events-none" style={{ backgroundImage: noiseTexture }}></div>
                <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: `url(${faleDolSvg})` }}></div>
                
                <h2 className="relative z-10 text-white font-black text-4xl md:text-5xl text-right leading-[1.1] tracking-tight">
                  ZNAJDŹ<br/>WYMARZONEGO<br/>ERASMUSA
                </h2>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;