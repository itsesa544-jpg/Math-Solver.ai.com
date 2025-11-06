
import React from 'react';
import { OutputFormat } from '../types';

interface OutputAreaProps {
  activeOutputFormat: OutputFormat;
  setActiveOutputFormat: (format: OutputFormat) => void;
  onSampleProblemClick: (problem: string) => void;
  solution: string;
  isLoading: boolean;
  error: string;
}

const sampleProblems = {
  'বীজগণিত': ['x^2 - 5x + 6 = 0', '2x + 5 = 15'],
  'পাটীগণিত': ['20% কে ভগ্নাংশে প্রকাশ কর', '500 এর 10% কত?'],
  'জ্যামিতি': ['y = 3x + 2 এর গ্রাফ আঁক', 'একটি ত্রিভুজের ভূমি 10 এবং উচ্চতা 5 হলে ক্ষেত্রফল কত?'],
  'ত্রিকোণমিতি': ['sin(30°) এর মান কত?', 'cos(A) = 4/5 হলে tan(A) = ?'],
};

const OutputArea: React.FC<OutputAreaProps> = ({
  activeOutputFormat,
  setActiveOutputFormat,
  onSampleProblemClick,
  solution,
  isLoading,
  error
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2 rounded-lg bg-slate-100 p-1">
          {(Object.keys(OutputFormat) as Array<keyof typeof OutputFormat>).map((key) => {
             const format = OutputFormat[key];
             const labels = {
                [OutputFormat.Detailed]: 'বিস্তারিত',
                [OutputFormat.Brief]: 'সংক্ষিপ্ত',
                [OutputFormat.Direct]: 'সরাসরি উত্তর',
             };
             return (
              <button
                key={format}
                onClick={() => setActiveOutputFormat(format)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeOutputFormat === format
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {labels[format]}
              </button>
            );
            })}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-slate-600">নমুনা সমস্যা:</h3>
        <div className="space-y-3">
          {Object.entries(sampleProblems).map(([category, problems]) => (
            <div key={category}>
              <p className="text-sm font-semibold text-slate-500 mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {problems.map((prob) => (
                  <button
                    key={prob}
                    onClick={() => onSampleProblemClick(prob)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full hover:bg-slate-200 transition-colors"
                  >
                    {prob}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="bg-slate-50 rounded-lg p-4 min-h-[150px] flex justify-center items-center">
          {error && <p className="text-red-600 text-center">{error}</p>}
          {!error && isLoading && <p className="text-slate-500 animate-pulse">আপনার জন্য সমাধান তৈরি করা হচ্ছে...</p>}
          {!error && !isLoading && !solution && (
            <p className="text-slate-500 text-center">আপনার সমাধান এখানে দেখানো হবে।</p>
          )}
          {!error && !isLoading && solution && (
            <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: solution.replace(/\n/g, '<br />') }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputArea;
