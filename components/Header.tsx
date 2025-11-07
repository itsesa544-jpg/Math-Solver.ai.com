import React from 'react';
import { HistoryIcon } from './Icons';

interface HeaderProps {
  onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-700">
          গণিত সমাধান - <span className="text-blue-600">Math Solver</span>
        </h1>
        <button 
          onClick={onHistoryClick} 
          className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="View history"
        >
          <HistoryIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;