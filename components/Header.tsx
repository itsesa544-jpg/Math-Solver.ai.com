import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-transparent pt-2 pb-0">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl font-bold text-slate-700 text-center flex items-center justify-center gap-3">
              <span>:(</span>
              <span>গণিত সমাধান AI</span>
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-300">ডেমো</span>
        </div>
      </div>
    </header>
  );
};

export default Header;