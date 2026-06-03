import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import tloDol from '../assets/Grafika4.svg'; 

const noiseTexture = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

export default function SearchPage() {
  const navigate = useNavigate();

  const [kierunkiUEK, setKierunkiUEK] = useState([]);
  const [semestryUEK, setSemestryUEK] = useState([]);
  const [wybranyKierunek, setWybranyKierunek] = useState('');
  const [wybranySemestr, setWybranySemestr] = useState('');
  const [czyLaduje, setCzyLaduje] = useState(true);

  useEffect(() => {
    const fetchDane = async () => {
      const { data } = await supabase.from('przedmioty').select('kierunek_nazwa').eq('uczelnia_nazwa', 'UEK');
      if (data) setKierunkiUEK([...new Set(data.map(i => i.kierunek_nazwa).filter(Boolean))].sort());
      setCzyLaduje(false);
    };
    fetchDane();
  }, []);

  useEffect(() => {
    if (!wybranyKierunek) { setSemestryUEK([]); setWybranySemestr(''); return; }
    const fetchSemestry = async () => {
      const { data } = await supabase.from('przedmioty').select('semestr').eq('uczelnia_nazwa', 'UEK').eq('kierunek_nazwa', wybranyKierunek);
      if (data) setSemestryUEK([...new Set(data.map(i => i.semestr).filter(Boolean))].sort((a, b) => a - b));
    };
    fetchSemestry();
  }, [wybranyKierunek]);

  const handleWyszukaj = (e) => {
    e.preventDefault();
    navigate(`/wyniki?kierunek=${encodeURIComponent(wybranyKierunek)}&semestr=${wybranySemestr}`);
  };

  const czyZablokowany = !wybranyKierunek || !wybranySemestr;

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-16">
      
      {/* LEWA: Formularz Odkrywcy */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <form onSubmit={handleWyszukaj} className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-black text-[#a420eb] uppercase tracking-widest">Wymagane</h2>
            <input type="text" value="Uniwersytet Ekonomiczny w Krakowie" disabled className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-sm text-gray-400 cursor-not-allowed outline-none" />
            <select value={wybranyKierunek} onChange={(e) => setWybranyKierunek(e.target.value)} disabled={czyLaduje} className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-sm text-gray-800 outline-none focus:border-[#2470ff] transition-all">
              <option value="" disabled>-- Wybierz kierunek --</option>
              {kierunkiUEK.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <select value={wybranySemestr} onChange={(e) => setWybranySemestr(e.target.value)} disabled={!wybranyKierunek} className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-sm text-gray-800 outline-none focus:border-[#2470ff] transition-all">
              <option value="" disabled>-- Wybierz semestr --</option>
              {semestryUEK.map(s => <option key={s} value={s}>Semestr {s}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-5 opacity-60 pointer-events-none">
            <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest">Opcjonalnie</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="np. Hiszpania" className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-sm" disabled />
              <input type="text" placeholder="np. Madryt" className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-sm" disabled />
            </div>
            <input type="text" placeholder="np. Angielski" className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-sm" disabled />
          </div>

          <button type="submit" disabled={czyZablokowany} className="w-full mt-4 bg-black hover:bg-gray-800 text-white font-black uppercase tracking-widest py-5 rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg">
            Szukaj
          </button>
        </form>
      </div>

      {/* PRAWA: Baner */}
      <div className="w-full lg:w-1/2 aspect-square max-w-[500px] mx-auto rounded-[3rem] bg-gradient-to-br from-[#2470ff] via-[#2470ff] to-[#a420eb] via-[70%] relative flex items-center justify-end px-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.45] mix-blend-overlay pointer-events-none" style={{ backgroundImage: noiseTexture }}></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: `url(${tloDol})` }}></div>
        <h2 className="relative z-10 text-white font-black text-4xl md:text-5xl text-right leading-[1.1] tracking-tight">
          ZNAJDŹ<br/>WYMARZONEGO<br/>ERASMUSA
        </h2>
      </div>

    </div>
  );
}