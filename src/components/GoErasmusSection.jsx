import { Link } from 'react-router-dom';
import NoiseOverlay from './NoiseOverlay';
import InputField from './InputField';
import grafika5 from '../assets/Grafika5.svg';

export default function GoErasmusSection() {
  return (
    <section id="jade" className="w-full py-24 px-4 md:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 bg-gray-50/50 border-t border-gray-200">
      
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-erasmo-purple font-black text-2xl uppercase tracking-tighter">Uczelnia Macierzysta</h2>
          <div className="flex flex-col gap-3">
            <InputField label="Uczelnia" placeholder="np. Uniwersytet Ekonomiczny w Krakowie" />
            <InputField label="Kierunek studiów" placeholder="np. Informatyka Stosowana" />
            <InputField label="Rok i semestr" placeholder="np. 3 rok, semestr letni" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-erasmo-gray font-black text-2xl uppercase tracking-tighter">Uczelnia Partnerska</h2>
          <div className="flex flex-col gap-3">
            <InputField label="Uczelnia" placeholder="np. Uniwersytet w Madrycie" />
            <InputField label="Kraj" placeholder="np. Hiszpania" />
            <InputField label="Język wykładowy" placeholder="np. Angielski" />
          </div>
        </div>

        <Link to="/sylabusy" className="mt-4 w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors uppercase tracking-[0.2em] text-sm flex items-center justify-center">
          SZUKAJ
        </Link>
      </div>

      <div className="hidden lg:flex w-[450px] aspect-square bg-gradient-to-br from-[#3AA3F7] via-[#2848D3] via-60% to-[#be52a5] rounded-[2.5rem] shadow-2xl items-center justify-center p-12 relative overflow-hidden">
        <NoiseOverlay />
        
        {/* Usunięto odbicie lustrzane */}
        <img 
          src={grafika5} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none" 
        />

        <div className="text-right w-full relative z-20">
          <h1 className="text-white text-5xl font-black leading-[0.9] tracking-tighter uppercase drop-shadow-md">
            Jadę na<br />Erasmusa!
          </h1>
        </div>
      </div>
    </section>
  )
}