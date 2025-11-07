import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-transparent pt-2 pb-0">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="text-2xl font-bold text-slate-700 text-center flex items-center justify-center gap-3">
          <span>:(</span>
          <span>গণিত সমাধান AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
