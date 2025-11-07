
import React, { useRef, useState } from 'react';
import { OutputFormat, Solution } from '../types';
import { DownloadIcon } from './Icons';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface OutputAreaProps {
  activeOutputFormat: OutputFormat;
  setActiveOutputFormat: (format: OutputFormat) => void;
  onSampleProblemClick: (problem: string) => void;
  solution: Solution;
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const solutionContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!solutionContainerRef.current || !window.jspdf || !window.html2canvas) {
        alert('PDF generation library is not loaded yet.');
        return;
    }
    
    setIsGeneratingPdf(true);
    try {
        const canvas = await window.html2canvas(solutionContainerRef.current, {
            scale: 2,
            backgroundColor: '#f8fafc', // Same as bg-slate-50
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pdfWidth - margin * 2;
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = canvasWidth / canvasHeight;
        const imgHeight = contentWidth / aspectRatio;

        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
        heightLeft -= (pdfHeight - margin * 2);

        while (heightLeft > 0) {
            position = -heightLeft - margin;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
            heightLeft -= (pdfHeight - margin * 2);
        }

        pdf.save('ganit-samadhan.pdf');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        setIsGeneratingPdf(false);
    }
  };


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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-slate-700">সমাধান:</h3>
          {solution && !isLoading && (
            <button 
              onClick={handleDownloadPdf} 
              disabled={isGeneratingPdf}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-wait transition-colors"
              aria-label="Download solution as PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ডাউনলোড হচ্ছে...
                </>
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  PDF ডাউনলোড
                </>
              )}
            </button>
          )}
        </div>
        <div ref={solutionContainerRef} className="bg-slate-50 rounded-lg p-4 min-h-[150px] flex flex-col justify-center items-center">
          {error && <p className="text-red-600 text-center">{error}</p>}
          {!error && isLoading && <p className="text-slate-500 animate-pulse">আপনার জন্য সমাধান তৈরি করা হচ্ছে...</p>}
          {!error && !isLoading && !solution && (
            <p className="text-slate-500 text-center">আপনার সমাধান এখানে দেখানো হবে।</p>
          )}
          {!error && !isLoading && solution && (
            typeof solution === 'string' ? (
              <div className="prose prose-sm max-w-none text-slate-800 w-full" dangerouslySetInnerHTML={{ __html: solution.replace(/\n/g, '<br />') }} />
            ) : (
              <div className="w-full space-y-4">
                <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: solution.explanation.replace(/\n/g, '<br />') }} />
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-base font-semibold text-slate-700 mb-2">গ্রাফ:</h4>
                  <img src={solution.graphImage} alt="Generated graph of the solution" className="w-full h-auto rounded-lg border bg-white" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputArea;