import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
// POPRAWIONY IMPORT
import { supabase } from '../supabaseClient'; 
import { calculateOptimalMatches } from '../utils/matchMaker'; 

const SyllabusComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const wybranyKierunek = searchParams.get('kierunek');
  const wybranySemestr = searchParams.get('semestr');
  const wybranaUczelnia = searchParams.get('uczelnia');

  const [wynikiAI, setWynikiAI] = useState(null);
  const [czyAnalizuje, setCzyAnalizuje] = useState(true); 

  useEffect(() => {
    if (!wybranyKierunek || !wybranySemestr || !wybranaUczelnia) {
      navigate('/');
      return;
    }

    const generujRaport = async () => {
      try {
        const { data: wybranePrzedmiotyUEK } = await supabase
          .from('przedmioty')
          .select('*')
          .eq('uczelnia_nazwa', 'UEK')
          .eq('kierunek_nazwa', wybranyKierunek) 
          .eq('semestr', wybranySemestr);

        const { data: ofertaZagr } = await supabase
          .from('przedmioty')
          .select('*')
          .eq('uczelnia_nazwa', wybranaUczelnia);

        if (!wybranePrzedmiotyUEK || wybranePrzedmiotyUEK.length === 0) {
          setWynikiAI([]);
          return;
        }

        const uekIds = wybranePrzedmiotyUEK.map(p => p.id);
        const zagrIds = ofertaZagr.map(p => p.id);

        const { data: dopasowania, error } = await supabase
          .from('dopasowania')
          .select('*')
          .in('przedmiot_pl_id', uekIds)
          .in('przedmiot_zagr_id', zagrIds);

        if (error) throw error;

        // Nasz mądry algorytm
        const ostateczneWyniki = calculateOptimalMatches(wybranePrzedmiotyUEK, ofertaZagr, dopasowania);
        setWynikiAI(ostateczneWyniki);

      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setCzyAnalizuje(false);
      }
    };

    generujRaport();
  }, [wybranyKierunek, wybranySemestr, wybranaUczelnia, navigate]);

  return (
    <div className="w-full px-4 md:px-12 py-10 flex flex-col gap-8 relative font-sans bg-white min-h-screen">
      
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors w-max">
        <span>←</span> Wróć 
      </button>

      <div className="max-w-5xl mx-auto w-full space-y-8 mt-4">
        
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Twój Learning Agreement</h1>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold border border-gray-200 uppercase tracking-wider">UEK</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-md text-xs font-bold border border-purple-100 uppercase tracking-wider">
                {wybranyKierunek} (Sem. {wybranySemestr})
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uczelnia Docelowa</span>
            <span className="text-xl font-black text-[#2470ff]">{wybranaUczelnia}</span>
          </div>
        </div>

        {czyAnalizuje ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#a420eb] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse">Generowanie inteligentnego raportu...</p>
          </div>
        ) : (
          wynikiAI && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-green-200">✓</span>
                Zoptymalizowane Odpowiedniki
              </h2>
              
              {wynikiAI.length === 0 ? (
                <p className="text-gray-500 italic p-4">Nie znaleziono polskich przedmiotów dla tego semestru.</p>
              ) : (
                <div className="space-y-4">
                  {wynikiAI.map((wynik, index) => (
                    wynik.znaleziono ? (
                      <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:border-purple-300 transition-colors">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Wymóg (Polska)</span>
                            <span className="text-gray-900 font-bold uppercase">{wynik.przedmiot_pl}</span>
                          </div>
                          <div className="text-gray-300 font-black hidden md:block">→</div>
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] text-[#2470ff] uppercase tracking-wider font-bold">Propozycja (Zagranica)</span>
                            <span className="text-[#a420eb] font-bold uppercase">{wynik.przedmiot_zagr}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 w-full md:w-auto shrink-0 shadow-sm">
                            <span className="text-2xl font-black text-green-600">{wynik.zgodnosc}%</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Zgodność</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 italic leading-relaxed">
                            <span className="font-bold text-gray-700 not-italic">Uzasadnienie AI: </span> 
                            {wynik.uzasadnienie}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="bg-red-50/50 p-5 rounded-xl border border-red-100 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Wymóg (Polska)</span>
                            <span className="text-gray-700 font-bold uppercase">{wynik.przedmiot_pl}</span>
                          </div>
                          <div className="text-red-200 font-black hidden md:block">→</div>
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">Propozycja (Zagranica)</span>
                            <span className="text-red-600 font-bold uppercase">{wynik.przedmiot_zagr}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-white px-4 py-3 rounded-lg border border-red-200 w-full md:w-auto shrink-0 shadow-sm">
                            <span className="text-2xl font-black text-red-500">⚠</span>
                            <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Brak</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-red-100">
                          <p className="text-xs text-gray-600 italic leading-relaxed">
                            <span className="font-bold text-red-500 not-italic">Informacja: </span> 
                            {wynik.uzasadnienie}
                          </p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SyllabusComparePage;