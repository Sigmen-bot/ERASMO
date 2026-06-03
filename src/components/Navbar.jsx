import { Link } from 'react-router-dom';
import logoSvg from '../assets/Logo1.svg'; 

export default function Navbar() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-12 h-24 flex items-center justify-between">
        
        <Link 
          to="/" 
          onClick={scrollToTop}
          className="flex items-center h-full transition-transform duration-300 hover:scale-105"
        >
          {/* brightness-0 zamienia jasne SVG na głęboką czerń */}
          <img 
            src={logoSvg} 
            alt="ERASMO" 
            className="h-14 w-auto object-contain brightness-0 scale-150 origin-left" 
          />
        </Link>

        <div className="flex items-center h-full">
          <button className="text-2xl font-black text-gray-300 hover:text-black transition-colors px-4 py-2">
            ?
          </button>
        </div>
        
      </div>
    </nav>
  );
}