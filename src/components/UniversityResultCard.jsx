import { Link } from 'react-router-dom';

export default function UniversityResultCard({ name, matchPercentage }) {
  return (
    <Link 
      to="/uczelnia"
      className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-erasmo-purple/30 transition-all cursor-pointer group"
    >
      <h3 className="text-lg font-bold text-gray-800 group-hover:text-erasmo-purple transition-colors">
        {name}
      </h3>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Dopasowanie
        </span>
        <span className="text-2xl font-black text-erasmo-purple">
          {matchPercentage}%
        </span>
      </div>
    </Link>
  )
}