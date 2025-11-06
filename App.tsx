
import React, { useState, useCallback } from 'react';
import { solveMathProblem } from './services/geminiService';
import { InputTab, OutputFormat } from './types';
import Header from './components/Header';
import InputArea from './components/InputArea';
import OutputArea from './components/OutputArea';
import Footer from './components/Footer';
import AboutModal from './components/AboutModal';

const App: React.FC = () => {
  const [activeInputTab, setActiveInputTab] = useState<InputTab>(InputTab.Text);
  const [activeOutputFormat, setActiveOutputFormat] = useState<OutputFormat>(OutputFormat.Detailed);
  const [problemInput, setProblemInput] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [solution, setSolution] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  const handleSolve = useCallback(async () => {
    if (activeInputTab === InputTab.Text && !problemInput.trim()) {
      setError('অনুগ্রহ করে একটি সমস্যা লিখুন।');
      return;
    }
    if (activeInputTab === InputTab.Image && !imageFile) {
      setError('অনুগ্রহ করে একটি ছবি আপলোড করুন।');
      return;
    }

    setIsLoading(true);
    setSolution('');
    setError('');

    try {
      const result = await solveMathProblem({
        text: problemInput,
        image: imageFile,
        inputMethod: activeInputTab,
        outputFormat: activeOutputFormat,
      });
      setSolution(result);
    } catch (err) {
      console.error(err);
      setError('সমাধান তৈরি করতে একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }, [problemInput, imageFile, activeInputTab, activeOutputFormat]);

  const onSampleProblemClick = (problem: string) => {
    setProblemInput(problem);
    setActiveInputTab(InputTab.Text);
    setImageFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto max-w-4xl p-4">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6">
          <InputArea
            activeInputTab={activeInputTab}
            setActiveInputTab={setActiveInputTab}
            problemInput={problemInput}
            setProblemInput={setProblemInput}
            imageFile={imageFile}
            setImageFile={setImageFile}
            handleSolve={handleSolve}
            isLoading={isLoading}
          />
          <OutputArea
            activeOutputFormat={activeOutputFormat}
            setActiveOutputFormat={setActiveOutputFormat}
            onSampleProblemClick={onSampleProblemClick}
            solution={solution}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
      <Footer onBrandClick={() => setIsAboutModalOpen(true)} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
    </div>
  );
};

export default App;
