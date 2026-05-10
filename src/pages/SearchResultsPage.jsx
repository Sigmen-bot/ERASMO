import NoiseOverlay from '../components/NoiseOverlay';
import UniversityResultCard from '../components/UniversityResultCard';
import grafika4 from '../assets/Grafika4.svg'; // Import grafiki

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
      
      {/* LEWA STRONA: LISTA WYNIKÓW */}
      <div className="w-full max-w-md flex flex-col gap-6">
        <h2 className="text-erasmo-purple font-black text-3xl uppercase tracking-tighter mb-2">
          Wyniki:
        </h2>
        
        <div className="flex flex-col gap-4">
          <UniversityResultCard name="Uniwersytet w Zagrzebiu" matchPercentage={90} />
          <UniversityResultCard name="Uniwersytet w Madrycie" matchPercentage={80} />
          <UniversityResultCard name="Uniwersytet w Paryżu" matchPercentage={75} />
          <UniversityResultCard name="Uniwersytet w Rzymie" matchPercentage={60} />
        </div>
      </div>

      {/* PRAWA STRONA: BANNER Z DODANYM SZLACZKIEM */}
      <div className="hidden lg:flex w-[450px] aspect-square bg-gradient-to-br from-[#3AA3F7] via-[#2848D3] via-60% to-[#be52a5] rounded-[2.5rem] shadow-2xl items-center justify-center p-12 relative overflow-hidden">
        <NoiseOverlay />
        
        {/* Szlaczek */}
        <img 
          src={grafika4} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none" 
        />

        <div className="text-right w-full relative z-20">
          <h1 className="text-white text-5xl font-black leading-[0.9] tracking-tighter uppercase drop-shadow-md">
            Znajdź<br />
            Wymarzonego<br />
            Erasmusa
          </h1>
        </div>
      </div>

    </div>
  )
}