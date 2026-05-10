import NoiseOverlay from '../components/NoiseOverlay';
import AboutSection from '../components/AboutSection';
import SearchSection from '../components/SearchSection';
import GoErasmusSection from '../components/GoErasmusSection';

// Importujemy wybraną grafikę fali
import grafika1 from '../assets/Grafika1.svg';

export default function HomePage() {
  return (
    <div className="bg-white flex flex-col items-center w-full">
      <section className="w-full flex flex-col items-center pt-12 pb-24 px-4 md:px-8">
        
        <div className="w-full max-w-6xl flex flex-col gap-2 mb-8">
          <span className="text-erasmo-purple font-bold tracking-widest uppercase text-xs">
            Twój kompas na Erasmusie
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">
            Zorganizuj swój wyjazd <br className="hidden md:block" />
            bez zbędnego stresu.
          </h2>
        </div>

        {/* GŁÓWNA KARTA Z GRADIENTEM */}
        <div className="w-full max-w-6xl aspect-[21/9] md:aspect-[3/1] bg-gradient-to-br from-[#3AA3F7] via-[#2848D3] via-60% to-[#be52a5] rounded-2xl shadow-lg flex items-center justify-end p-8 md:p-16 relative overflow-hidden">
          
          <NoiseOverlay />

          {/* TWOJE PRAWDZIWE FALE SVG */}
          <img 
            src={grafika1} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none" 
          />

          <div className="text-right z-10">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-sm uppercase">
              TWOJA PODRÓŻ <br />
              CZEKA
            </h1>
          </div>
        </div>

        {/* PRZYCISKI (Reszta bez zmian) */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-3xl justify-center">
          <a href="#szukaj" className="flex-1 bg-black text-white text-center font-bold py-5 px-8 rounded-xl hover:bg-gray-800 transition-colors uppercase tracking-[0.1em] text-sm shadow-md cursor-pointer">
            Znajdź wymarzonego Erasmusa
          </a>
          <a href="#jade" className="flex-1 bg-white border border-gray-300 text-black text-center font-bold py-5 px-8 rounded-xl hover:border-black hover:bg-gray-50 transition-colors uppercase tracking-[0.1em] text-sm shadow-sm cursor-pointer">
            Jestem już zakwalifikowany/a
          </a>
        </div>
        <p className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
          Dołącz do 1000+ studentów, którzy uprościli swój Learning Agreement
        </p>
      </section>

      <AboutSection />
      <SearchSection />
      <GoErasmusSection />
    </div>
  )
}