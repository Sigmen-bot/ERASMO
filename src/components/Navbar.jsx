import { Link } from 'react-router-dom';
import logoSvg from '../assets/Logo1.svg'; 

export default function Navbar() {
  // Funkcja, która płynnie przewija na górę strony
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 md:px-12 h-20 flex items-center justify-between">
        
        {/* Dodano onClick oraz transformacje dla płynnego powiększania: transition-transform duration-300 hover:scale-105 */}
        <Link 
          to="/" 
          onClick={scrollToTop}
          className="flex items-center h-full transition-transform duration-300 hover:scale-105"
        >
          <img src={logoSvg} alt="ERASMO" className="h-14 w-auto object-contain brightness-0 scale-150 origin-left" />
        </Link>

        <div className="flex items-center h-full gap-6">
          <button className="text-xl font-bold text-gray-400 hover:text-black transition-colors">
            ?
          </button>
        </div>
        
      </div>
    </nav>
  )
}