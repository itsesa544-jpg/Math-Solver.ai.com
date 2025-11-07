import React from 'react';
import { Solution, OutputFormat } from '../types';

interface OutputAreaProps {
  solution: Solution;
  isLoading: boolean;
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
}

const FormatTab: React.FC<{ label: string; name: OutputFormat; isActive: boolean; onClick: () => void }> = ({ label, name, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
      isActive
        ? 'bg-white text-slate-800 shadow-sm'
        : 'bg-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {label}
  </button>
);

const OutputArea: React.FC<OutputAreaProps> = ({ solution, isLoading, outputFormat, setOutputFormat }) => {
  const renderSolution = () => {
    if (typeof solution === 'string') {
      return <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: solution.replace(/\n/g, '<br />') }} />;
    }
    if (solution?.isGraph) {
      return (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: solution.explanation.replace(/\n/g, '<br />') }} />
          <div className="mt-4 border-t pt-4">
            <h4 className="text-base font-semibold text-slate-700 mb-2">গ্রাফ:</h4>
            <img src={solution.graphImage} alt="Generated graph of the solution" className="w-full h-auto rounded-lg border bg-white" />
          </div>
        </div>
      );
    }
    return <p className="text-slate-500 text-center py-8">আপনার সমাধান এখানে দেখানো হবে।</p>;
  };

  return (
    <div className="mt-6">
       <div className="bg-blue-50/50 rounded-xl shadow-lg border border-slate-200/80 p-1.5">
            <div className="bg-white rounded-lg p-4 sm:p-6">
                <header className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">সমাধান</h2>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                    <FormatTab label="বিস্তারিত" name={OutputFormat.Detailed} isActive={outputFormat === OutputFormat.Detailed} onClick={() => setOutputFormat(OutputFormat.Detailed)} />
                    <FormatTab label="সংক্ষিপ্ত" name={OutputFormat.Brief} isActive={outputFormat === OutputFormat.Brief} onClick={() => setOutputFormat(OutputFormat.Brief)} />
                    </div>
                </header>
                <div className="mt-4 min-h-[100px]">
                    {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="flex items-center space-x-2 text-slate-500">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>লোড হচ্ছে...</span>
                        </div>
                    </div>
                    ) : (
                    renderSolution()
                    )}
                </div>
            </div>
       </div>
    </div>
  );
};

export default OutputArea;
