import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import UniversityDetailsPage from './pages/UniversityDetailsPage';
import SyllabusComparePage from './pages/SyllabusComparePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white flex flex-col">
        
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wyniki" element={<SearchResultsPage />} />
            <Route path="/uczelnia" element={<UniversityDetailsPage />} />
            <Route path="/sylabusy" element={<SyllabusComparePage />} />
          </Routes>
        </main>

        {/* Zmieniono na border-gray-100, aby linia była ledwie widoczna */}
        <footer className="h-20 border-t border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
          © 2026 ERASMO — Wszystkie prawa zastrzeżone
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App;