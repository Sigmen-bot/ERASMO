import { Link } from 'react-router-dom';

export default function SyllabusComparePage() {
  // Przykładowe dane do tabel, żebyśmy nie musieli kopiować kodu w nieskończoność
  const subjects = [
    "PRZEDMIOT 1",
    "PRZEDMIOT 2",
    "PRZEDMIOT 3",
    "PRZEDMIOT 4",
    "PRZEDMIOT 5",
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-10">
        
        {/* GÓRNY PASEK i NAGŁÓWEK */}
        <div className="flex flex-col gap-4">
          <Link 
            to="/jade" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-erasmo-purple transition-colors uppercase tracking-widest"
          >
            <span>←</span> Wróć do wyszukiwarki
          </Link>
          
          <div>
            <h1 className="text-erasmo-purple text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Jadę na Erasmusa!
            </h1>
            <p className="text-gray-400 font-bold text-lg uppercase tracking-widest mt-2">
              Sprawdź przykładowe dopasowanie
            </p>
          </div>
        </div>

        {/* SEKCJA Z TABELAMI (Dwie kolumny na dużych ekranach) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* TABELA 1: UCZELNIA MACIERZYSTA */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-gray-50 p-6 rounded-t-2xl border-b-4 border-erasmo-purple">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                Uniwersytet Ekonomiczny <br/> w Krakowie
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">
                Lista sylabusów na rok akademicki 2025/2026
              </p>
            </div>
            
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-100">
                  {subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-sm font-bold text-gray-700">{subject}</td>
                      <td className="p-5 text-sm font-bold text-gray-400 text-right">{subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ZNAK ZAPYTANIA / SEPARATOR (Opcjonalny detal ze slajdu) */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl">
              ?
            </div>
          </div>

          {/* TABELA 2: UCZELNIA PARTNERSKA */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-gray-50 p-6 rounded-t-2xl border-b-4 border-erasmo-pink">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                Uniwersytet <br/> w Madrycie
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">
                Lista sylabusów na rok akademicki 2025/2026
              </p>
            </div>
            
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-100">
                  {subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-sm font-bold text-gray-700">{subject}</td>
                      <td className="p-5 text-sm font-bold text-gray-400 text-right">{subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}