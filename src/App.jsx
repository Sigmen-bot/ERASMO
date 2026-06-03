import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import UniversityDetailsPage from './pages/UniversityDetailsPage';
import SyllabusComparePage from './pages/SyllabusComparePage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-white flex flex-col font-sans">
        
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* ODKRYWCA (Ranking) */}
            <Route path="/wyniki" element={<SearchResultsPage />} />
            {/* ZDECYDOWANY (Szczegóły) */}
            <Route path="/sylabusy" element={<SyllabusComparePage />} />
            <Route path="/uczelnia" element={<UniversityDetailsPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;