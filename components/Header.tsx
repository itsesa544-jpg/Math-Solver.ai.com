import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl p-4 flex justify-center items-center">
        <h1 className="text-xl font-bold text-slate-700">
          গণিত সমাধান - <span className="text-blue-600">Math Solver</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;