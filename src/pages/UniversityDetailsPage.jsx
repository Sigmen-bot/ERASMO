import { Link } from 'react-router-dom';

export default function UniversityDetailsPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-12 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        
        {/* GÓRNY PASEK: Przycisk powrotu */}
        <div>
          <Link 
            to="/wyniki" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-erasmo-purple transition-colors uppercase tracking-widest"
          >
            <span>←</span> Wróć do listy
          </Link>
        </div>

        {/* NAGŁÓWEK UCZELNI */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
            Uniwersytet <br />
            W Madrycie
          </h1>
          <a href="#" className="text-erasmo-purple font-bold hover:underline underline-offset-4">
            LINK DO STRONY UCZELNI
          </a>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-4">
            Stan na rok akademicki 2025/2026:
          </p>
        </div>

        {/* TABELA PRZEDMIOTÓW */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest w-2/5">
                  Uniwersytet Ekonomiczny w Krakowie
                </th>
                <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest w-2/5 border-l border-gray-100">
                  Uniwersytet w Madrycie
                </th>
                <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest w-1/5 text-center border-l border-gray-100">
                  Zgodność
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-bold text-gray-800">FINANSE PRZEDSIĘBIORSTWA</td>
                <td className="p-5 text-sm font-bold text-gray-600 border-l border-gray-100">CORPORATE FINANCE</td>
                <td className="p-5 text-lg font-black text-erasmo-purple text-center border-l border-gray-100">90%</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-bold text-gray-800">ZARZĄDZANIE PROJEKTAMI INNOWACYJNYMI</td>
                <td className="p-5 text-sm font-bold text-gray-600 border-l border-gray-100">PROJECT MANAGEMENT</td>
                <td className="p-5 text-lg font-black text-erasmo-purple text-center border-l border-gray-100">75%</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-bold text-gray-800">RACHUNKOWOŚĆ W KORPORACJI</td>
                <td className="p-5 text-sm font-bold text-gray-600 border-l border-gray-100">CORPORATE ACCOUNTING</td>
                <td className="p-5 text-lg font-black text-erasmo-purple text-center border-l border-gray-100">80%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PRZYCISK PREMIUM */}
        <div className="flex justify-center md:justify-end mt-4">
          <button className="bg-erasmo-pink text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest text-sm shadow-md">
            Pobierz Raport Premium
          </button>
        </div>

      </div>
    </div>
  )
}